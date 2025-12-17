import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  async findAll() {
    return this.problemsService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.problemsService.getStats();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.problemsService.search(query);
  }

  @Get('difficulty/:difficulty')
  async findByDifficulty(@Param('difficulty') difficulty: string) {
    return this.problemsService.findByDifficulty(difficulty);
  }

  @Get('company/:company')
  async findByCompany(@Param('company') company: string) {
    return this.problemsService.findByCompany(company);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.problemsService.findOne(slug);
  }

  @Get('test/test')
  test() {
    return { message: 'Problems endpoint working' };
  }
}