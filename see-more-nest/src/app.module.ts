  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { ConfigModule } from '@nestjs/config';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

  @Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
      }),
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'see_more_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Set to false in production
        logging: true,
      }),
      ProductsModule,
      UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}