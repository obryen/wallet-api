// schemas/account.schema.ts
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class Account extends Document {
  @Field(() => ID)
  _id: string;
  @Field()
  @Prop({ required: true })
  name: string;
  @Field()
  @Prop({ required: true, unique: true })
  email: string;
  @Field()
  @Prop({ required: true })
  password: string;
  @Field()
  @Prop({ default: 0 })
  version: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
