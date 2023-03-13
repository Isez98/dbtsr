import { Field, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { PropertyRental } from './PropertyRental'

@ObjectType()
@Entity()
export class Owner extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column()
  name!: string

  @Field(() => String)
  @Column()
  email: string

  @Field(() => String)
  @Column()
  phone: string

  @OneToMany(() => PropertyRental, (propertyRental) => propertyRental.owner)
  properties: PropertyRental[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}
