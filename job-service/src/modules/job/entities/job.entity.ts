// src/modules/jobs/entities/job.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column({nullable :false})
  companyName!: string;

  @Column()
  createdBy!: string; // userId from JWT

  @CreateDateColumn()
  createdAt!: Date;
}
