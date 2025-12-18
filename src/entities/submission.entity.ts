import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Problem } from './problem.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.submissions)
  user: User;

  @ManyToOne(() => Problem, problem => problem.submissions)
  problem: Problem;

  @Column()
  language: string; // 'python', 'cpp', 'java'

  @Column('text')
  code: string;

  @Column()
  status: string; // 'pending', 'running', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compile_error'

  @Column({ nullable: true })
  runtime: number; // in milliseconds

  @Column({ nullable: true })
  memory: number; // in MB

  @Column({ nullable: true })
  total_test_cases: number;

  @Column({ nullable: true })
  passed_test_cases: number;

  @Column('jsonb', { nullable: true })
  test_case_results: any[];

  @Column('text', { nullable: true })
  error_message: string;

  @CreateDateColumn()
  created_at: Date;
}