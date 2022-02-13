import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PropertyRental } from "./PropertyRental";
import { User } from "./User";

@ObjectType()
@Entity()
export class Rent extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  checkIn: Date;

  @Field(() => String)
  @Column()
  checkOut: Date;

  @Field(() => String)
  @Column()
  client: String;

  @Field()
  @Column()
  rate: number;

  @Field(() => Int)
  @Column()
  deposit: number;

  @Field(() => Int)
  @Column()
  cleaningFee: number;

  @Field(() => Int)
  @Column()
  people: number;

  @Field()
  @Column()
  extraGuestRate: number;

  @Field(() => String)
  @Column("text")
  notes: string;

  @ManyToOne(() => PropertyRental, (propertyRental) => propertyRental.rents)
  property: PropertyRental;

  @ManyToOne(() => User, (user) => user.rents)
  renterId: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
