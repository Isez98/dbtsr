import { Owner } from "../entities/Owner";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class OwnerResolver {
  @Query(() => [Owner])
  async owners(): Promise<Owner[]> {
    return Owner.find();
  }

  @Query(() => Owner, { nullable: true })
  owner(@Arg("id", () => Int) id: number): Promise<Owner | undefined> {
    return Owner.findOne(id);
  }

  @Mutation(() => Owner)
  async createOwner(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("phone") phone: string
  ): Promise<Owner | null> {
    if(!name){
      return null;
    }
    else if(!email && phone){
      return Owner.create({name, phone}).save();
    }
    else if(!phone && email){
      return Owner.create({name, email}).save();
    }
    else if(!phone && !email){
      return Owner.create({name}).save();
    }
    return Owner.create({ name, email, phone }).save();    
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
  async deleteOWner(@Arg("id") id: number) : Promise<boolean> {
    try{
      await Owner.delete(id);
    } catch(error){
      return false;
    }
    return true;
  }
}
