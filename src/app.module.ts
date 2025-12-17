import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module'; // Add this
import { User } from './entities/user.entity';
import { Problem } from './entities/problem.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'codeiitk',
      entities: [User, Problem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Problem]),
    AuthModule,
    ProblemsModule, // Add this line
  ],
  controllers: [AppController],
})
export class AppModule {}