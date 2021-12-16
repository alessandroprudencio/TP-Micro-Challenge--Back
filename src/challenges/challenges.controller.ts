import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private challengeService: ChallengesService) {}

  @EventPattern('challenge.findAll')
  async findAll1(): Promise<IChallenge[]> {
    return await this.challengeService.findAll();
  }

  @MessagePattern('challenge.findAll')
  async findAll2(): Promise<IChallenge[]> {
    return await this.challengeService.findAll();
  }

  @EventPattern('challenge.create')
  async create(@Payload() createChallengeDto: CreateChallengeDto, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.challengeService.create(createChallengeDto);
    } catch (error) {
      new RpcException(error.message);
    } finally {
      channel.ack(originalMsg);
    }
  }

  // @Get(':id')
  // async findOne(
  //   @Param('id', MongoIdValidation) id: string,
  // ): Promise<IChallenge> {
  //   return await this.challengeService.findOne(id);
  // }

  // @Put(':id')
  // @UsePipes(ValidationPipe)
  // async update(
  //   @Param('id', MongoIdValidation) id: string,
  //   @Body() updateChallengeDto: UpdateChallengeDto,
  // ): Promise<IChallenge> {
  //   return await this.challengeService.update(id, updateChallengeDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.challengeService.delete(id);
  // }

  // @Post(':id/match')
  // @UsePipes(ValidationPipe)
  // async setMatchChallenge(
  //   @Body() setMatchChallengeDto: SetMatchChallengeDto,
  //   @Param('id') id: string,
  // ): Promise<IChallenge> {
  //   return await this.challengeService.setMatchChallenge(
  //     id,
  //     setMatchChallengeDto,
  //   );
  // }
}
