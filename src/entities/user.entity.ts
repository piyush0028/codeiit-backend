import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { OneToMany } from 'typeorm';
import { Submission } from './submission.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  iitk_email: string;

  @Column({ nullable: true })
  verification_token: string; // Just 'string' here, nullable is handled by database

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

  
  @OneToMany(() => Submission, submission => submission.user)
  submissions: Submission[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password_hash) {
      this.password_hash = await bcrypt.hash(this.password_hash, 12);
    }

  
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}