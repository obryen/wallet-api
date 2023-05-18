// dto/create-account.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class LoginDto {

  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(6, { message: 'Password should be at least 6 characters long' })
  password: string;
}
