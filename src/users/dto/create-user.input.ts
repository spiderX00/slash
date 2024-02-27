import { Field } from "@nestjs/graphql";

export class CreateUserInput {
    @Field(() => Number)
    id?: number;

    @Field(() => String)
    username: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    password: string;
}
