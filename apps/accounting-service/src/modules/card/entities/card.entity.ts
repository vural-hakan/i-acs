import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { bigIntTransformer } from '../../../common';
import { UserEntity } from '../../user/entities';
@Entity({ name: 'card' })
export class CardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: string;

  @ManyToOne(() => UserEntity, (user) => user.cards)
  user: UserEntity;

  @Column({ nullable: true })
  userId: number;

  @Column({
    type: 'bigint',
    nullable: false,
    transformer: [bigIntTransformer],
  })
  createdAt: number;

  @BeforeInsert()
  public setCreatedAt() {
    this.createdAt = new Date().getTime();
    this.updatedAt = new Date().getTime();
  }

  @Column({
    type: 'bigint',
    nullable: true,
    transformer: [bigIntTransformer],
  })
  updatedAt: number;

  @BeforeUpdate()
  public setUpdatedAt() {
    this.updatedAt = new Date().getTime();
  }
}
