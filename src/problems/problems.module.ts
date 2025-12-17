import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';
import { Problem } from '../entities/problem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Problem])],
  providers: [ProblemsService],
  controllers: [ProblemsController],
})
export class ProblemsModule {}