import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';  // Add this
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
      username: 'postgres',  // or 'codeiit_user'
      password: 'postgres',  // or 'password123'
      database: 'codeiitk',
      entities: [User, Problem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Problem]),
  ],
  controllers: [AppController],  // Add this line
})
export class AppModule {}