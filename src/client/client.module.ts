import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
// import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports:[],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule {}
