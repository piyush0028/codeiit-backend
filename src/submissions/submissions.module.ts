import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { JwtSubmissionsGuard } from './jwt-submissions.guard';
import { Submission } from '../entities/submission.entity';
import { Problem } from '../entities/problem.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Problem, User]),
    JwtModule,
  ],
  providers: [SubmissionsService, JwtSubmissionsGuard],
  controllers: [SubmissionsController],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}