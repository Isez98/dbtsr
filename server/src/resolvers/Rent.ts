import { Rent } from '../entities/Rent'
import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import { getConnection } from 'typeorm'
import { FieldError } from './User'

@InputType()
class RentInput {
  @Field()
  checkIn: Date

  @Field()
  checkOut: Date

  @Field()
  rate: number

  @Field()
  people: number

  @Field()
  propertyId: number

  @Field()
  userId: number

  @Field()
  clientName: string

  @Field()
  notes: string
}

@ObjectType()
class RentResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Rent, { nullable: true })
  rent?: Rent
}

@Resolver()
export class RentResolver {
  @Query(() => [Rent])
  async rents(): Promise<Rent[]> {
    return Rent.find()
  }

  @Query(() => Rent, { nullable: true })
  rent(@Arg('id', () => Int) id: number): Promise<Rent | undefined> {
    return Rent.findOne(id)
  }

  @Mutation(() => RentResponse)
  async createRent(@Arg('input') input: RentInput): Promise<RentResponse> {
    if (input.checkIn > input.checkOut) {
      return {
        errors: [
          {
            field: 'Input dates',
            message: 'Check in date cannot be greater than the check out date.',
          },
        ],
      }
    }

    const replacements: any[] = [
      input.propertyId,
      input.checkIn,
      input.checkOut,
    ]

    const checkExistence = await getConnection().query(
      `
        select r.*
        from "rent" r
        where r."propertyId" = $1
        and ($2 < r."checkOut" and $3 > r."checkIn")
      `,
      replacements
    )

    console.log(checkExistence)

    if (checkExistence[0]) {
      return {
        errors: [
          {
            field: '',
            message: 'Rent already exist for this property at the given dates!',
          },
        ],
      }
    }
    let rent
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Rent)
        .values({
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          propertyId: input.propertyId,
          client: input.clientName,
          rate: input.rate,
          people: input.people,
          notes: input.notes,
          userId: input.userId,
        })
        .returning('*')
        .execute()
      rent = result.raw[0]
    } catch (error) {
      if (error.code === '23505') {
        return {
          errors: [
            {
              field: 'rent',
              message: 'Rent already exists for these dates',
            },
          ],
        }
      }
    }
    return { rent }
  }
}
