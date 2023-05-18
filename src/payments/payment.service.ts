// payments.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { AccountBalance } from './schemas/account-balance.schema';
import { Account } from '../account/schemas/account.schema';
import { MakePaymentDto } from './dtos/make-payment-dto';
import { IValidateTransferResult } from './interfaces/validate-payment-result.interface';


@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(AccountBalance.name) private accountBalanceModel: Model<AccountBalance>,
  ) { }


  async fetchTransactions(email: string): Promise<Payment[]> {
    const payments = await this.paymentModel.aggregate([
      {
        $lookup: {
          from: 'accounts',
          localField: 'sender',
          foreignField: '_id',
          as: 'senderAccount',
        },
      },
      {
        $lookup: {
          from: 'accounts',
          localField: 'recipient',
          foreignField: '_id',
          as: 'recipientAccount',
        },
      },
      {
        $addFields: {
          senderEmail: { $arrayElemAt: ['$senderAccount.email', 0] },
          recipientEmail: { $arrayElemAt: ['$recipientAccount.email', 0] },
        },
      },
      // {
      //   $match: {
      //     'senderAccount.email': email,
      //   },
      // },
      {
        $project: {
          _id: 1,
          sender: { $arrayElemAt: ['$senderAccount.name', 0] },
          recipient: { $arrayElemAt: ['$recipientAccount.name', 0] },
          amount: 1,
          senderRunningBalance: 1,
          timestamp: 1,
          version: 1,
        },
      },
    ]);


    return payments

  }

  async makeTransfer(payload: MakePaymentDto, senderEmail: string) {

    const validatedAccount: IValidateTransferResult = await this.validateTransfer(payload, senderEmail);
    try {

      // Update the sender's and recipient's balances
      validatedAccount.senderBalance.balance -= payload.amount;
      validatedAccount.recipientBalance.balance += payload.amount;

      // optimistic lock: Increment the version field of the sender and recipient accounts
      validatedAccount.senderBalance.version++;
      validatedAccount.recipientBalance.version++;

      // Save the updated accounts
      await validatedAccount.senderBalance.save();
      await validatedAccount.recipientBalance.save();

      // Create a new payment
      const createdTransaction = new this.paymentModel({
        sender: validatedAccount.senderAccount.id,
        recipient: validatedAccount.recipientAccount.id,
        senderRunningBalance: validatedAccount.senderBalance.balance,
        amount: payload.amount,
        timestamp: new Date(),
      });

      // Save the transaction
      const savedTransaction = await createdTransaction.save();
      // emit message to kafka topic [transaction_events]
      return savedTransaction;
    } catch (error) {
      Logger.log('[makeTransfer] something went wrong', error)
      throw new InternalServerErrorException();
    }
  }


  private async validateTransfer(input: MakePaymentDto, senderEmail: string): Promise<IValidateTransferResult> {
    // cannot send to yourself
    if (senderEmail === input.recipientEmail) {
      throw new BadRequestException('You cannot send yourself money :)');
    }

    // Retrieve and check the sender's account
    const senderAccount = await this.accountModel.findOne({ email: senderEmail });
    if (!senderAccount) {
      throw new NotFoundException('Sender account not found');
    }


    // Retrieve and check the recipient's account
    const recipientAccount = await this.accountModel.findOne({ email: input.recipientEmail });
    if (!recipientAccount) {
      throw new NotFoundException('Recipient account not found');
    }

    // Retrieve and check the sender's account balance
    const senderBalance = await this.accountBalanceModel.findOne({ accountId: senderAccount.id });
    if (!senderBalance || senderBalance.balance < input.amount) {
      throw new UnprocessableEntityException('Insufficient balance');
    }

    // Retrieve and check the sender's account balance
    const recipientBalance = await this.accountBalanceModel.findOne({ accountId: recipientAccount.id });
    if (!recipientBalance) {
      throw new UnprocessableEntityException('Invalid recipient');
    }



    return { senderAccount, senderBalance, recipientAccount, recipientBalance };
  }
}
