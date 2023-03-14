import { Field, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { PropertyRental } from './PropertyRental'
import { User } from './User'

@ObjectType()
@Entity()
export class Rent extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column()
  checkIn: Date

  @Field(() => String)
  @Column()
  checkOut: Date

  @Field(() => String)
  @Column()
  client: String

  @Field()
  @Column()
  rate: number

  @Field(() => Int)
  @Column()
  people: number

  @Field(() => String)
  @Column('text')
  notes: string

  @Field(() => Int)
  @Column()
  propertyId: number

  @ManyToOne(() => PropertyRental, (propertyRental) => propertyRental.rents)
  property: PropertyRental

  @Field(() => Int)
  @Column()
  userId: number

  @ManyToOne(() => User, (user) => user.rents)
  user: User

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}
