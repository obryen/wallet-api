import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SessionDto {
  @Field()
  token: string
  @Field()
  status: boolean
}
