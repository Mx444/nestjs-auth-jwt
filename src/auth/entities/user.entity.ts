/** @format */

import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
