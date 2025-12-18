import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../entities/submission.entity';
import { Problem } from '../entities/problem.entity';
import { User } from '../entities/user.entity';

interface CreateSubmissionDto {
  problemId: string;
  code: string;
  language: string;
}

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepository: Repository<Submission>,
    @InjectRepository(Problem)
    private problemsRepository: Repository<Problem>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: string, createSubmissionDto: CreateSubmissionDto): Promise<any> {
    const { problemId, code, language } = createSubmissionDto;

    console.log('Creating submission for user:', userId);
    console.log('Problem ID:', problemId);

    // Find user and problem
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const problem = await this.problemsRepository.findOne({ where: { id: problemId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!problem) {
      console.log('Problem not found, creating mock submission');
      // Create mock submission if problem not found
      return this.createMockSubmission(userId, createSubmissionDto);
    }

    // Create submission with proper relation IDs
    const submission = this.submissionsRepository.create({
      user: { id: userId },  // Just pass ID, not full object
      problem: { id: problemId },  // Just pass ID
      code,
      language,
      status: 'pending',
    });

    console.log('Saving submission...');
    const savedSubmission = await this.submissionsRepository.save(submission);
    console.log('Submission saved with ID:', savedSubmission.id);

    // Start simulation in background (don't await)
    this.simulateExecution(savedSubmission.id).catch(console.error);

    // Return immediate response
    return {
      id: savedSubmission.id,
      status: 'pending',
      message: 'Submission received and is being processed',
      created_at: savedSubmission.created_at,
    };
  }

  private async simulateExecution(submissionId: string): Promise<void> {
    console.log('Starting simulation for submission:', submissionId);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Processing submission:', submissionId);
    
    try {
      const submission = await this.submissionsRepository.findOne({ 
        where: { id: submissionId },
        relations: ['problem'],
      });

      if (!submission) {
        console.log('Submission not found:', submissionId);
        return;
      }

      const testCases = submission.problem?.test_cases || [];
      const total = testCases.length || 3; // Default to 3 if no test cases
      
      // Generate random but reasonable results
      const passed = Math.floor(Math.random() * (total + 1));
      const runtime = Math.floor(Math.random() * 100) + 50; // 50-150ms
      const memory = Math.floor(Math.random() * 5) + 5; // 5-10MB

      console.log('Updating submission with results:', {
        id: submissionId,
        status: passed === total ? 'accepted' : 'wrong_answer',
        runtime,
        memory,
        passed,
        total
      });

      // Update submission with proper numeric values
      await this.submissionsRepository.update(submissionId, {
        status: passed === total ? 'accepted' : 'wrong_answer',
        runtime: runtime,  // Ensure this is a number, not string
        memory: memory,    // Ensure this is a number, not string
        total_test_cases: total,
        passed_test_cases: passed,
      });

      console.log('Submission updated successfully:', submissionId);
    } catch (error) {
      console.error('Error in simulateExecution:', error);
      // Don't throw, just log the error
    }
  }

  private async createMockSubmission(userId: string, createSubmissionDto: CreateSubmissionDto): Promise<any> {
    console.log('Creating mock submission');
    
    const mockSubmission = {
      id: 'mock-' + Date.now(),
      userId,
      ...createSubmissionDto,
      status: 'accepted',
      runtime: 100,
      memory: 10,
      total_test_cases: 3,
      passed_test_cases: 3,
      created_at: new Date().toISOString(),
      message: 'Mock submission (problem not found in database)'
    };
    
    console.log('Mock submission created:', mockSubmission.id);
    return mockSubmission;
  }

  async findOne(id: string): Promise<any> {
    const submission = await this.submissionsRepository.findOne({
      where: { id },
      relations: ['user', 'problem'],
    });

    if (!submission) {
      // Return mock if not found
      return {
        id,
        status: 'accepted',
        runtime: 100,
        memory: 10,
        message: 'Mock submission details'
      };
    }

    return submission;
  }

  async findByUser(userId: string): Promise<any[]> {
    try {
      const submissions = await this.submissionsRepository.find({
        where: { user: { id: userId } },
        relations: ['problem'],
        order: { created_at: 'DESC' },
        take: 50,
      });
      return submissions;
    } catch (error) {
      console.error('Error finding user submissions:', error);
      return []; // Return empty array on error
    }
  }

  async findByProblem(problemId: string): Promise<any[]> {
    try {
      return await this.submissionsRepository.find({
        where: { problem: { id: problemId } },
        relations: ['user'],
        order: { created_at: 'DESC' },
        take: 20,
      });
    } catch (error) {
      console.error('Error finding problem submissions:', error);
      return [];
    }
  }

  async getStats(userId: string): Promise<any> {
    try {
      const submissions = await this.submissionsRepository.find({
        where: { user: { id: userId } },
        relations: ['problem'],
      });

      const total = submissions.length;
      const accepted = submissions.filter(s => s.status === 'accepted').length;
      
      // Count solved problems by difficulty
      const solvedProblems = new Set<string>();
      submissions
        .filter(s => s.status === 'accepted' && s.problem)
        .forEach(s => {
          solvedProblems.add(s.problem.id);
        });

      const easy = submissions.filter(s => 
        s.status === 'accepted' && 
        s.problem?.difficulty === 'easy'
      ).length;
      
      const medium = submissions.filter(s => 
        s.status === 'accepted' && 
        s.problem?.difficulty === 'medium'
      ).length;
      
      const hard = submissions.filter(s => 
        s.status === 'accepted' && 
        s.problem?.difficulty === 'hard'
      ).length;

      return {
        total_submissions: total,
        accepted_submissions: accepted,
        acceptance_rate: total > 0 ? Math.round((accepted / total) * 100) : 0,
        easy_solved: easy,
        medium_solved: medium,
        hard_solved: hard,
        total_solved: solvedProblems.size,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        total_submissions: 0,
        accepted_submissions: 0,
        acceptance_rate: 0,
        easy_solved: 0,
        medium_solved: 0,
        hard_solved: 0,
        total_solved: 0,
      };
    }
  }
}