/** @format */

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/entities/base.entity';
import { User } from './user.entity';

@Entity({ name: 'refreshTokens' })
export class RefreshToken extends BaseEntity {
  @Column({ type: 'integer' })
  @Index()
  userId: number;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 500, unique: true })
  @Index()
  tokenHash: string;

  @Column({ type: 'boolean', default: false })
  @Index()
  isRevoked: boolean;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
