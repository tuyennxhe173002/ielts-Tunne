import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LessonsModule } from '../lessons/lessons.module';
import { AdminAssetsController, StudentAssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

@Module({
  imports: [LessonsModule, JwtModule.register({})],
  controllers: [AdminAssetsController, StudentAssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
