import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from 'src/players/players.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { Challenge, ChallengeSchema } from './schemas/challenge.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Challenge.name, schema: ChallengeSchema }]), PlayersModule],
  controllers: [ChallengesController],
  providers: [ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
