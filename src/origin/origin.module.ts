import { Module } from '@nestjs/common';
import { OriginController } from './origin.controller';
import { OriginService } from './origin.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OriginController],
  providers: [OriginService],
})
export class OriginModule {}
