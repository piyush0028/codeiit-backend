import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'CodeIITK Backend is running!';
  }

  @Get('health')
  getHealth(): { status: string } {
    return { status: 'OK' };
  }

  @Get('test')
  test(): { message: string } {
    return { message: 'Backend is working!' };
  }
}