// accounts.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Account } from '../schemas/account.schema';
import { CreateAccountDto } from '../dto/create-account-dto';
import { LoginDto } from '../dto/login-dto';
import { SessionDto } from '../dto/session-dto';
import { FetchAccountDto } from '../dto/fetch-account-dto';
import { ILoggedInUser } from '../interfaces/logged-in-user.interface';
import { AccountBalance } from 'src/payments/schemas/account-balance.schema';

@Injectable()
export class AccountsService {
  constructor(@InjectModel(Account.name) private accountModel: Model<Account>, @InjectModel(AccountBalance.name) private accountBalanceModel: Model<AccountBalance>, private readonly jwtService: JwtService,) { }

  async create(payload: CreateAccountDto): Promise<Account> {
    const hashedPassword = await hash(payload.password, 10);

    const createdAccount = new this.accountModel({ name: payload.name, email: payload.email, password: hashedPassword });
    return createdAccount.save();
  }

  async creditNewAccount(accountId: string): Promise<AccountBalance> {
    const DEFAULT_CREDIT_AMOUNT = 1000000; // should be removed in prod
    const topUpNewAccount = new this.accountBalanceModel({ balance: DEFAULT_CREDIT_AMOUNT, accountId })
    return topUpNewAccount.save()
  }

  async fetchOne(payload: FetchAccountDto): Promise<Account> {
    const account = await this.accountModel.findOne({ email: payload.email }).exec();
    if (!account) {
      throw new Error('Sender account not found');
    }

    return account;
  }

  async login(payload: LoginDto): Promise<SessionDto> {
    const passwordIsValid = await this.validateUserPassword(payload.email, payload.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Please check your credentials and try again')
    }
    const payloadToSign: ILoggedInUser = {
      email: passwordIsValid.email,
      id: passwordIsValid._id,
      name: passwordIsValid.name
    }
    // sign token
    const newToken = this.jwtService.sign({
      user: payloadToSign
    });
    return {
      status: true,
      token: newToken
    }
  }

  async validateUserPassword(email: string, password: string): Promise<Account> {
    const account = await this.accountModel.findOne({ email }).exec();
    if (account && await compare(password, account.password)) {
      return account;
    }
    return null;
  }

  async validateAccountBeforePayment(senderEmail: string, recipientEmail: string) {
    const senderAccount = await this.accountModel.findOne({ email: senderEmail });
    if (!senderAccount) {
      throw new Error('Sender account not found');
    }

    const recipientAccount = await this.accountModel.findOne({ email: recipientEmail });
    if (!recipientAccount) {
      throw new Error('Recipient account not found');
    }

    return { senderAccount, recipientAccount };
  }
}
