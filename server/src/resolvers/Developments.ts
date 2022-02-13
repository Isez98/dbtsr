import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Developments } from "../entities/Developments";

@InputType()
class DevelopmentInput {
  @Field()
  name: String;

  @Field()
  location: String;

  @Field()
  logo: String;
}

@Resolver()
export class DevelopmentsResolver {
  @Query(() => [Developments])
  async developments(): Promise<Developments[]> {
    return Developments.find();
  }

  @Query(() => Developments, { nullable: true })
  development(
    @Arg("id", () => Int) id: number
  ): Promise<Developments | undefined> {
    return Developments.findOne(id);
  }

  @Mutation(() => Developments)
  async createDevelopment(
    @Arg("input") input: DevelopmentInput
  ): Promise<Developments> {
    return Developments.create({
      ...input,
    }).save();
  }

  // Insert update query here...

  @Mutation(() => Boolean)
  async deleteDevelopment(@Arg("id") id: number): Promise<boolean> {
    try {
      await Developments.delete(id);
    } catch (error) {
      return false;
    }
    return true;
  }
}
