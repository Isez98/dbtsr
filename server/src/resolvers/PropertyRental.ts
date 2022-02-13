import { PropertyRental } from "../entities/PropertyRental";
import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  InputType,
  Field,
} from "type-graphql";

@InputType()
class PropertyInput {
  @Field()
  designation: string;

  @Field()
  album: string;

  @Field()
  notes: string;
}

@Resolver()
export class PropertyRentalResolver {
  @Query(() => [PropertyRental])
  async properties(): Promise<PropertyRental[]> {
    return PropertyRental.find();
  }

  @Query(() => PropertyRental, { nullable: true })
  property(
    @Arg("id", () => Int) id: number
  ): Promise<PropertyRental | undefined> {
    return PropertyRental.findOne(id);
  }

  @Mutation(() => PropertyRental)
  async createProperty(
    @Arg("input") input: PropertyInput
  ): Promise<PropertyRental> {
    // 2 SQL queries
    return PropertyRental.create({
      ...input,
    }).save();
  }

  @Mutation(() => PropertyRental, { nullable: true })
  async updateProperty(
    @Arg("id") id: number,
    // note: can make fields optional to update. Example => @Arg('designation', () => String, {nullable: true}) designation : string
    @Arg("designation") designation: string
  ): Promise<PropertyRental | null> {
    const property = await PropertyRental.findOne(id);
    if (!property) {
      return null;
    }
    if (typeof designation !== "undefined") {
      await PropertyRental.update({ id }, { designation });
    }
    return property;
  }

  @Mutation(() => Boolean)
  async deleteProperty(@Arg("id") id: number): Promise<boolean> {
    try {
      await PropertyRental.delete(id);
    } catch (error) {
      return false;
    }
    return true;
  }
}
