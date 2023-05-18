import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountBalance } from './schemas/account-balance.schema';
import { Account } from 'src/account/schemas/account.schema';



@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(AccountBalance.name) private accountBalanceModel: Model<AccountBalance>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) { }


  async checkBalance(email: string): Promise<AccountBalance> {

    // Retrieve and check the recipient's account
    const account = await this.accountModel.findOne({ email });
    if (!account) {
      throw new NotFoundException('Recipient account not found');
    }

    // Retrieve and check the sender's account balance
    const balance = await this.accountBalanceModel.findOne({ accountId: account.id });
    if (!balance) {
      throw new UnprocessableEntityException('Insufficient balance');
    }

    return balance
  }
}
