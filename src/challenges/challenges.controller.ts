import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext, RpcException } from '@nestjs/microservices';
import { CategoriesService } from 'src/categories/categories.service';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  private clientRabbitMQRanking = this.clientProxy.getClientProxyRabbitmq('micro-ranking-back');

  constructor(
    private challengeService: ChallengesService,
    private categoryService: CategoriesService,
    private clientProxy: ClientProxyRabbitMq,
  ) {
    this.challengeService = challengeService;
    this.categoryService = categoryService;
    this.clientProxy = clientProxy;
  }

  @MessagePattern('find-all-challenge')
  async findAll(@Ctx() context: RmqContext): Promise<IChallenge[]> {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      return await this.challengeService.findAll();
    } catch (error) {
      throw new RpcException(error.message);
    } finally {
      channel.ack(originalMsg);
    }
  }

  @EventPattern('create-challenge')
  async create(@Payload() createChallengeDto: CreateChallengeDto, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      await this.challengeService.create(createChallengeDto);
    } catch (error) {
      throw new RpcException(error.message);
    } finally {
      channel.ack(originalMsg);
    }
  }

  @MessagePattern('find-one-challenge')
  async findOne(@Payload() id: string, @Ctx() context: RmqContext): Promise<IChallenge> {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      return await this.challengeService.findOne(id);
    } catch (error) {
      throw new RpcException(error.message);
    } finally {
      channel.ack(originalMsg);
    }
  }

  @MessagePattern('find-challenges-player')
  async findChallengesPlayer(@Payload() playerId: string, @Ctx() context: RmqContext): Promise<IChallenge[]> {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      return await this.challengeService.findChallengesPlayer(playerId);
    } catch (error) {
      throw new RpcException(error.message);
    } finally {
      channel.ack(originalMsg);
    }
  }

  @EventPattern('update-challenge')
  async update(@Payload() updateChallengeDto: any, @Ctx() context: RmqContext): Promise<IChallenge> {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      const id: string = updateChallengeDto.id;

      const challenge: IChallenge = updateChallengeDto.challenge;

      return await this.challengeService.update(id, challenge);
    } catch (error) {
      throw new RpcException(error.message);
    } finally {
      channel.ack(originalMsg);
    }
  }

  @EventPattern('delete-challenge')
  async remove(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      await this.challengeService.delete(id);
    } catch (error) {
      throw new RpcException(error.message);
    } finally {
      channel.ack(originalMsg);
    }
  }

  @EventPattern('set-result-challenge')
  async setScoreChallenge(@Payload() setScoreChallenge: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    const { id, result } = setScoreChallenge;

    const challenge = await this.challengeService.findOne(id);

    const category = await this.categoryService.foundCategoryById(challenge.category);

    try {
      await this.challengeService.setScore(id, result);

      console.log('setScore=>', { id, result });

      this.clientRabbitMQRanking.emit('proccess-ranking', { player: result.winPlayer, score: category.score });
    } catch (error) {
      throw new RpcException(error.message);
    } finally {
      channel.ack(originalMsg);
    }
  }
}
