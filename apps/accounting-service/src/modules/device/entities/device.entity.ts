import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { bigIntTransformer } from '../../../common';
@Entity({ name: 'device' })
export class DeviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

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
