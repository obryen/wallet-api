import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';

import { Account } from './schemas/account.schema';

import { AccountsService } from './services/account.service';
import { CreateAccountDto } from './dto/create-account-dto';
import { LoginDto } from './dto/login-dto';
import { FetchAccountDto } from './dto/fetch-account-dto';
import { SessionDto } from './dto/session-dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth-guard';

@Resolver('Accounts')
export class AccountsResolver {
  constructor(private accountsService: AccountsService) { }

  @UseGuards(AuthGuard)
  @Query(() => Account)
  async getAccountDetails(@Args('fetchAccountDto') fetchAccountDto: FetchAccountDto): Promise<Account> {
    return await this.accountsService.fetchOne(fetchAccountDto);
  }

  @Mutation(() => Account)
  async createAccount(
    @Args('createAccountDto') createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    const savedAccount = await this.accountsService.create(createAccountDto);
    // crediting new accounts should be disabled, purely for demonstration value
    await this.accountsService.creditNewAccount(savedAccount._id)
    return savedAccount
  }

  @Mutation(() => SessionDto)
  async login(
    @Args('loginDto') loginDto: LoginDto,
  ): Promise<SessionDto> {
    return await this.accountsService.login(loginDto);
  }

  // rest of the class
}
