
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schemas/account.schema';
import { AccountsService } from './services/account.service';
import { AccountsResolver } from './account.resolver';
import { JwtModule } from '@nestjs/jwt';
import { AccountBalance, AccountBalanceSchema } from '../payments/schemas/account-balance.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }, { name: AccountBalance.name, schema: AccountBalanceSchema }]),
    JwtModule.register({ global: true, secret: 'aeb', signOptions: { expiresIn: '3600s' } }),
    ],
    providers: [AccountsService, AccountsResolver],
    exports: [AccountsService],
})
export class AccountsModule { }
