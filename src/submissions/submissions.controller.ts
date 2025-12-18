import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtSubmissionsGuard } from './jwt-submissions.guard';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get('test')
  test() {
    console.log('✅ /submissions/test endpoint called');
    return { 
      message: 'Submissions endpoint working',
      timestamp: new Date().toISOString()
    };
  }

  @UseGuards(JwtSubmissionsGuard)
  @Post()
  async create(@Request() req, @Body() createSubmissionDto: any) {
    console.log('Creating submission for user:', req.user.userId);
    return this.submissionsService.create(req.user.userId, createSubmissionDto);
  }

  @UseGuards(JwtSubmissionsGuard)
  @Get('me')
  async findMySubmissions(@Request() req) {
    return this.submissionsService.findByUser(req.user.userId);
  }

  @UseGuards(JwtSubmissionsGuard)
  @Get('stats')
  async getMyStats(@Request() req) {
    return this.submissionsService.getStats(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Get('problem/:problemId')
  async findByProblem(@Param('problemId') problemId: string) {
    return this.submissionsService.findByProblem(problemId);
  }
}