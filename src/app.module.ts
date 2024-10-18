import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientModule } from './client/client.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/auth.guard';



@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductModule,
    CacheModule.register({
      ttl: 3600, // Tempo de vida padrão do cache em segundos (1 hora)
      isGlobal: true, // Para tornar o cache disponível globalmente
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ClientModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ]
})
export class AppModule {}
