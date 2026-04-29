// application.entity.ts
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn,
  Index 
} from 'typeorm';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

@Entity('applications')
@Index(['jobId', 'userId'], { unique: true }) // Optional: prevents duplicate applications
export class Application {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  @Index()
  jobId!: number;

  @Column({ type: 'int' })
  @Index()
  userId!: number;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  status!: ApplicationStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}