// payments.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { AccountsModule } from '../account/account.module';
import { PaymentsResolver } from './payment.resolver';
import { PaymentsService } from './payment.service';
import { AccountBalance, AccountBalanceSchema } from './schemas/account-balance.schema';
import { Account, AccountSchema } from '../account/schemas/account.schema';
import { BalanceService } from './balance.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }, { name: Account.name, schema: AccountSchema }, { name: AccountBalance.name, schema: AccountBalanceSchema }]),
    ],
    providers: [PaymentsService, PaymentsResolver, BalanceService],
})
export class PaymentsModule { }
