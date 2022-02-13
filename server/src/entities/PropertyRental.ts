import { ObjectType, Field, Int } from "type-graphql";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Owner } from "./Owner";
import { Rent } from "./Rent";
import { Developments } from "./Developments";

@ObjectType()
@Entity()
export class PropertyRental extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  designation!: string;

  @Field(() => String)
  @Column()
  album: string;

  @Field(() => String)
  @Column("text")
  notes: string;

  @Field(() => Int)
  @Column()
  ownerId: number;

  @Field()
  @Column()
  deposit: number;

  @Field()
  @Column()
  nightRate: number;

  @Field()
  @Column()
  cleaningFee: number;

  @Field(() => Int)
  @Column()
  maxPeople: number;

  @Field()
  @Column()
  holidayRate: number;

  @Field()
  @Column()
  extraGuestRate: number;

  @ManyToOne(() => Developments, (developments) => developments.properties)
  development: Developments;

  @Field(() => Boolean)
  @Column()
  completeRentControl: boolean;

  @ManyToOne(() => Owner, (owner) => owner.properties)
  owner: Owner;

  @OneToMany(() => Rent, (rent) => rent.property)
  rents: Rent[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
