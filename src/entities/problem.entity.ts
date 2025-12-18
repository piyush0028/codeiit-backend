import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Submission } from './submission.entity';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column()
  difficulty: string; // 'easy', 'medium', 'hard'

  @Column()
  asked_in_iitk_year: number;

  @Column()
  asked_by_company: string;

  @Column('jsonb')
  test_cases: any;

  @Column('jsonb')
  boilerplate_code: any;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Submission, submission => submission.problem)
  submissions: Submission[];
}