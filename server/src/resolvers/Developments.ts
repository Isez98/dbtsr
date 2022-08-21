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
import { Developments } from "../entities/Developments";
import { FieldError } from "./User";

@InputType()
class DevelopmentInput {
  @Field()
  name: String;

  @Field()
  location: String;

  @Field({ nullable: true })
  logo?: String;
}

@ObjectType()
class DevelopmentResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Developments, { nullable: true })
  development?: Developments;
}

@Resolver()
export class DevelopmentsResolver {
  @Query(() => [Developments])
  async developments(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Developments[]> {
    const realLimit = Math.min(50, limit);
    const qb = getConnection()
      .getRepository(Developments)
      .createQueryBuilder("d")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit);

    if (cursor) {
      qb.where('"createdAt" <:cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }
    return qb.getMany();
  }

  @Query(() => Developments, { nullable: true })
  development(
    @Arg("id", () => Int) id: number
  ): Promise<Developments | undefined> {
    return Developments.findOne(id);
  }

  @Mutation(() => DevelopmentResponse)
  async createDevelopment(
    @Arg("input") input: DevelopmentInput
  ): Promise<DevelopmentResponse> {
    const checkExistence = await Developments.findOne({
      where: { name: input.name },
    });
    if (checkExistence) {
      return {
        errors: [
          {
            field: "",
            message: "Development already exists!",
          },
        ],
      };
    }
    let development;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Developments)
        .values({
          name: input.name,
          location: input.location,
          logo: input.logo,
        })
        .returning("*")
        .execute();
      development = result.raw[0];
    } catch (error) {
      if (error === "23505") {
        return {
          errors: [
            {
              field: "name",
              message: "Development already exists",
            },
          ],
        };
      }
    }
    return {
      development,
    };
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
