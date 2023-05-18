import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class FetchAccountDto {

  @Field()
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

}
