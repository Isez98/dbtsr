import { Owner } from "../entities/Owner";
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@InputType()
class OwnerInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;
}

@ObjectType()
class OwnerResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Owner, { nullable: true })
  owner?: Owner;
}

@Resolver()
export class OwnerResolver {
  @Query(() => [Owner])
  owners(): Promise<Owner[]> {
    return Owner.find({});
  }

  @Query(() => Owner, { nullable: true })
  owner(@Arg("id", () => Int) id: number): Promise<Owner | undefined> {
    return Owner.findOne(id);
  }

  @Mutation(() => Owner)
  async createOwner(@Arg("options") options: OwnerInput): Promise<Owner> {
    return Owner.create(options).save();
  }

  // On hold until finding better way to update

  // @Mutation(() => Owner, { nullable: true })
  // async updateOWner(
  //   @Arg("id") id: number,
  //   @Arg("name") name: string,
  // ): Promise<Owner | null> {
  //   const owner = await Owner.findOne(id);
  //   if (!owner) {
  //     return null;
  //   }
  //   if (typeof )
  // }

  @Mutation(() => Boolean)
  async deleteOWner(@Arg("id") id: number): Promise<boolean> {
    try {
      await Owner.delete(id);
    } catch (error) {
      return false;
    }
    return true;
  }
}
