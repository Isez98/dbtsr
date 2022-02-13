import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PropertyRental } from "./PropertyRental";

@ObjectType()
@Entity()
export class Developments extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  name: String;

  @Field(() => String)
  @Column("text")
  location: String;

  @Field(() => String)
  @Column()
  logo: String;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => PropertyRental,
    (propertyRental) => propertyRental.development
  )
  properties: PropertyRental[];
}
