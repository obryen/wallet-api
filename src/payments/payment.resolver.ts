
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { PaymentsService } from './payment.service';
import { Payment } from './schemas/payment.schema';
import { MakePaymentDto } from './dtos/make-payment-dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth-guard';
import { ILoggedInUser } from 'src/account/interfaces/logged-in-user.interface';
import { AccountBalance } from './schemas/account-balance.schema';
import { BalanceService } from './balance.service';

@Resolver(() => Payment)
export class PaymentsResolver {
    constructor(private paymentsService: PaymentsService, private balanceService: BalanceService) { }
    @UseGuards(AuthGuard)
    @Query(() => [Payment])
    async fetchTransactions(@Args('email') email: string): Promise<Payment[]> {
        return await this.paymentsService.fetchTransactions(email);
    }

    @UseGuards(AuthGuard)
    @Query(() => AccountBalance)
    async getAccountBalance(@Args('email') email: string): Promise<AccountBalance> {
        return await this.balanceService.checkBalance(email);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Payment)
    async transfer(
        @Args('makePaymentDto') makePaymentDto: MakePaymentDto,
        @Context() context: { req: Request }
    ): Promise<Payment> {

        const loggedInUser: ILoggedInUser = context.req["user"];
        return await this.paymentsService.makeTransfer(makePaymentDto, loggedInUser.email);
    }

}
