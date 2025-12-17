import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from '../entities/problem.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private problemsRepository: Repository<Problem>,
  ) {}

  async findAll(): Promise<Problem[]> {
    return this.problemsRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(slug: string): Promise<Problem> {
    const problem = await this.problemsRepository.findOne({
      where: { slug },
    });

    if (!problem) {
      throw new NotFoundException(`Problem with slug "${slug}" not found`);
    }

    return problem;
  }

  async findByDifficulty(difficulty: string): Promise<Problem[]> {
    return this.problemsRepository.find({
      where: { difficulty },
      order: { created_at: 'DESC' },
    });
  }

  async findByCompany(company: string): Promise<Problem[]> {
    return this.problemsRepository.find({
      where: { asked_by_company: company },
      order: { asked_in_iitk_year: 'DESC' },
    });
  }

  async search(query: string): Promise<Problem[]> {
    return this.problemsRepository
      .createQueryBuilder('problem')
      .where('problem.title ILIKE :query', { query: `%${query}%` })
      .orWhere('problem.description ILIKE :query', { query: `%${query}%` })
      .orderBy('problem.created_at', 'DESC')
      .getMany();
  }

  async getStats(): Promise<{
    total: number;
    easy: number;
    medium: number;
    hard: number;
    companies: { [key: string]: number };
  }> {
    const total = await this.problemsRepository.count();
    
    const difficulties = await this.problemsRepository
      .createQueryBuilder('problem')
      .select('problem.difficulty, COUNT(*) as count')
      .groupBy('problem.difficulty')
      .getRawMany();

    const companies = await this.problemsRepository
      .createQueryBuilder('problem')
      .select('problem.asked_by_company, COUNT(*) as count')
      .groupBy('problem.asked_by_company')
      .getRawMany();

    const stats = {
      total,
      easy: difficulties.find(d => d.difficulty === 'easy')?.count || 0,
      medium: difficulties.find(d => d.difficulty === 'medium')?.count || 0,
      hard: difficulties.find(d => d.difficulty === 'hard')?.count || 0,
      companies: companies.reduce((acc, curr) => {
        acc[curr.asked_by_company] = parseInt(curr.count);
        return acc;
      }, {}),
    };

    return stats;
  }
}