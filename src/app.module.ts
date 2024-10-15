import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientModule } from './client/client.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductModule,
    CacheModule.registerAsync({
      useFactory: async() => ({
        store: await redisStore({
          ttl: 10 * 1000,
        })
      }),
      isGlobal: true,

    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ClientModule,
    AuthModule
  ]
})
export class AppModule {}
