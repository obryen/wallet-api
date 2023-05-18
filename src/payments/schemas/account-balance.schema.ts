// schemas/account-balance.schema.ts
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class AccountBalance extends Document {
  @Field(() => ID)
  _id: string;
  @Prop({ required: true, ref: 'Account' })
  accountId: string;
  @Field()
  @Prop({ required: true })
  balance: number;
  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;
  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
  @Field()
  @Prop({ required: false, ref: 'Transaction' })
  lastTransactionId: string;
  @Field()
  @Prop({ default: 0 })
  version: number;
}

export const AccountBalanceSchema = SchemaFactory.createForClass(AccountBalance);
