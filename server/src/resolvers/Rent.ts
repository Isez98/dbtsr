import { Rent } from "src/entities/Rent";
import { isAuth } from "src/middleware/isAuth";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

@InputType()
class RentInput {
  @Field()
  checkIn: Date;

  @Field()
  checkOut: Date;

  @Field()
  client: string;

  @Field()
  nightRate: number;

  @Field()
  deposit: number;

  @Field()
  cleaningFee: number;

  @Field()
  notes: string;
}

@Resolver()
export class RentResolver {
  @Query(() => [Rent])
  async rents(): Promise<Rent[]> {
    return Rent.find();
  }

  @Query(() => Rent, { nullable: true })
  rent(@Arg("id", () => Int) id: number): Promise<Rent | undefined> {
    return Rent.findOne(id);
  }

  @Mutation(() => Rent)
  @UseMiddleware(isAuth)
  createRent(
    @Arg("input") input: RentInput,
    @Ctx() { req }: MyContext
  ): Promise<Rent> {
    return Rent.create({
      ...input,
      renterId: req.session.userId,
    }).save();
  }
}
