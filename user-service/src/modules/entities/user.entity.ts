import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  EMPLOYER = 'EMPLOYER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ select: false }) // Hides password by default in queries
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.JOB_SEEKER,
  })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;
}
