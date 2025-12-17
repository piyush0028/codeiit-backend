import { DataSource } from 'typeorm';
import { seedProblems } from './problems.seed';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'codeiitk',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: true,
});

AppDataSource.initialize()
  .then(async (dataSource) => {
    console.log('📦 Seeding database...');
    
    await seedProblems(dataSource);
    
    console.log('✅ Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });