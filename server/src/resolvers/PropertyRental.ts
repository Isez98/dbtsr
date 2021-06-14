import { PropertyRental } from "../entities/PropertyRental";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

@Resolver()
export class PropertyRentalResolver {
  @Query(() => [PropertyRental])
  async properties(
    @Ctx() {em}: MyContext) : Promise<PropertyRental[]>
  {
    await sleep(3000)
    return em.find(PropertyRental, {});
  }

  @Query(() => PropertyRental, {nullable: true})
  property(
    @Arg('id', () => Int) id: number,
    @Ctx() {em}: MyContext
    ) : Promise<PropertyRental | null>
  {
    return em.findOne(PropertyRental, {id});
  }

  @Mutation(() => PropertyRental)
  async createProperty(
    @Arg('designation') designation: string,
    @Ctx() {em}: MyContext
    ) : Promise<PropertyRental>
  {
    const property = em.create(PropertyRental, {designation});
    await em.persistAndFlush(property);
    return property;
  }

  @Mutation(() => PropertyRental, {nullable: true})
  async updateProperty(
    @Arg('id') id: number,
    // note: can make fields optional to update. Example => @Arg('designation', () => String, {nullable: true}) designation : string
    @Arg('designation') designation: string,
    @Ctx() {em}: MyContext
    ) : Promise<PropertyRental | null>
  {
    const property = await  em.findOne(PropertyRental, {id});
    if(!property){
      return null;
    }
    if(typeof designation !== 'undefined'){
      property.designation = designation
      await em.persistAndFlush(property);
    }
    return property;
  }
  
  @Mutation(() => Boolean)
  async deleteProperty(
    @Arg('id') id: number,
    @Ctx() {em}: MyContext
    ) : Promise<boolean>
  {
    try {
      await em.nativeDelete(PropertyRental, {id})      
    } catch (error) {
      return false;    
    }
    return true;
  }
}