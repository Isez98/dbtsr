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
import { getConnection } from "typeorm";
import { FieldError } from "./User";

@InputType()
class OwnerInput {
  @Field()
  name: string;

  @Field()
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
  async owners(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Owner[]> {
    const realLimit = Math.min(50, limit);
    const qb = getConnection()
      .getRepository(Owner)
      .createQueryBuilder("o")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit);

    if (cursor) {
      qb.where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }
    return qb.getMany();
  }

  @Query(() => Owner, { nullable: true })
  owner(@Arg("id", () => Int) id: number): Promise<Owner | undefined> {
    return Owner.findOne(id);
  }

  @Mutation(() => OwnerResponse)
  async createOwner(
    @Arg("options") options: OwnerInput
  ): Promise<OwnerResponse> {
    const checkExistence = await Owner.findOne({
      where: { email: options.email },
    });
    if (checkExistence) {
      return {
        errors: [
          {
            field: "",
            message: "",
          },
        ],
      };
    }
    let owner;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Owner)
        .values({
          name: options.name,
          email: options.email,
          phone: options.phone,
        })
        .returning("*")
        .execute();
      owner = result.raw[0];
    } catch (error) {
      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "email",
              message: "Email already exists",
            },
          ],
        };
      }
    }

    return {
      owner,
    };
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
