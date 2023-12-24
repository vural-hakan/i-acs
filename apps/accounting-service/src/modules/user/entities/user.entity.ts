import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { bigIntTransformer } from '../../../common';
import { CardEntity } from '../../card/entities';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

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

  @OneToMany(() => CardEntity, (card) => card.user, {
    cascade: ['insert', 'update'],
  })
  cards: CardEntity[];
}
