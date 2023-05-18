import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

@InputType()
export class MakePaymentDto {

  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Recipient email should not be empty' })
  recipientEmail: string;

  @Field()
  @IsNumber({}, { message: 'Amount should be a number' })
  @Min(0.01, { message: 'Amount should be greater than 0' })
  amount: number;
}
