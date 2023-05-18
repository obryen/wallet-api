import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class Payment extends Document {
    @Field(() => ID)
    _id: string;
    @Field()
    @Prop({ required: true })
    sender: string;
    @Field()
    @Prop({ required: true })
    recipient: string;
    @Field()
    @Prop({ required: true })
    amount: number;
    @Field()
    @Prop({ required: true })
    senderRunningBalance: number;
    @Field()
    @Prop({ default: Date.now })
    timestamp: Date;
    @Prop({ default: 0 })
    version: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
