import { PropertyRental } from '../entities/PropertyRental'
import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  InputType,
  Field,
  ObjectType,
} from 'type-graphql'
import { FieldError } from './User'
import { getConnection } from 'typeorm'

@InputType()
class PropertyInput {
  @Field()
  designation: string

  @Field()
  developmentId: number

  @Field()
  ownerId: number

  @Field({ nullable: true })
  album: string

  @Field({ nullable: true })
  notes: string
}

@ObjectType()
class PropertyRentalResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => PropertyRental, { nullable: true })
  propertyRental?: PropertyRental
}

// Modify later
@Resolver()
export class PropertyRentalResolver {
  @Query(() => [PropertyRental])
  async properties(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PropertyRental[]> {
    const realLimit = Math.min(50, limit)

    const replacements: any[] = [realLimit]
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
    }

    const properties = await getConnection().query(
      `    
        select p.*, 
        json_build_object('name', o.name) owner, 
        json_build_object('name', d.name) development  
        from "property_rental" p
        inner join public.owner o on o.id = p."ownerId"
        inner join public.developments d on d.id = p."developmentId"
        ${cursor ? `where p."createdAt" < $2` : ''}
        order by p."createdAt" DESC
        limit $1
    `,
      replacements
    )
    return properties
  }

  @Query(() => [PropertyRental])
  async ownerProperties(
    @Arg('id', () => Int) id: number,
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PropertyRental[]> {
    const realLimit = Math.min(50, limit)

    const replacements: any[] = [id, realLimit]
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
    }

    const properties = await getConnection().query(
      `
        select p.*, 
        json_build_object('name', o.name) owner, 
        json_build_object('name', d.name) development  
        from "property_rental" p
        inner join public.owner o on o.id = p."ownerId"
        inner join public.developments d on d.id = p."developmentId"
        where p."ownerId" = $1
        ${cursor ? `and p."createdAt" < $3` : ''}
        order by p."createdAt" DESC
        limit $2
      `,
      replacements
    )
    return properties
  }

  @Query(() => [PropertyRental])
  async developmentProperties(
    @Arg('id', () => Int) id: number,
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PropertyRental[]> {
    const realLimit = Math.min(50, limit)

    const replacements: any[] = [id, realLimit]
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
    }

    const properties = await getConnection().query(
      `
        select p.*,
        json_build_object('name', o.name) owner, 
        json_build_object('name', d.name) development  
        from "property_rental" p
        inner join public.owner o on o.id = p."ownerId"
        inner join public.developments d on d.id = p."developmentId"
        where p."developmentId" = $1
        ${cursor ? `and p."createdAt" < $3` : ''}
        order by p."createdAt" DESC
        limit $2
      `,
      replacements
    )
    return properties
  }

  @Query(() => PropertyRental, { nullable: true })
  property(
    @Arg('id', () => Int) id: number
  ): Promise<PropertyRental | undefined> {
    return PropertyRental.findOne(id)
  }

  @Mutation(() => PropertyRentalResponse)
  async createProperty(
    @Arg('input') input: PropertyInput
  ): Promise<PropertyRentalResponse> {
    const checkExistence = await PropertyRental.findOne({
      where: {
        designation: input.designation,
        // developmentId: input.developmentId,
      },
    })

    if (checkExistence) {
      return {
        errors: [
          {
            field: '',
            message: 'Property already exists!',
          },
        ],
      }
    }
    let propertyRental
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(PropertyRental)
        .values({
          designation: input.designation,
          ownerId: input.ownerId,
          developmentId: input.developmentId,
          album: input.album,
          notes: input.notes,
        })
        .returning('*')
        .execute()
      propertyRental = result.raw[0]
    } catch (error) {
      if (error.code === '23505') {
        return {
          errors: [
            {
              field: 'development',
              message: 'Condo already exists in this development',
            },
          ],
        }
      }
    }

    return {
      propertyRental,
    }
  }

  @Mutation(() => PropertyRental, { nullable: true })
  async updateProperty(
    @Arg('id') id: number,
    // note: can make fields optional to update. Example => @Arg('designation', () => String, {nullable: true}) designation : string
    @Arg('designation') designation: string
  ): Promise<PropertyRental | null> {
    const property = await PropertyRental.findOne(id)
    if (!property) {
      return null
    }
    if (typeof designation !== 'undefined') {
      await PropertyRental.update({ id }, { designation })
    }
    return property
  }

  @Mutation(() => Boolean)
  async deleteProperty(@Arg('id') id: number): Promise<boolean> {
    try {
      await PropertyRental.delete(id)
    } catch (error) {
      return false
    }
    return true
  }
}
