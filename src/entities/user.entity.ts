import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  iitk_email: string;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ default: false })
  iitk_verified: boolean;

  @Column()
  full_name: string;

  @Column({ unique: true })
  roll_number: string;

  @Column()
  branch: string;

  @Column()
  year_of_study: number;

  @Column('decimal', { precision: 4, scale: 2, nullable: true })
  cgpa: number;

  @Column()
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;
}