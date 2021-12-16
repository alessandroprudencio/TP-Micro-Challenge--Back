import { BadRequestException, Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayersService } from './players.service';

const ackErrors: string[] = ['E11000'];

@Controller('api/v1/players')
export class PlayersController {
  constructor(private playerService: PlayersService) {}

  @EventPattern('create-player')
  async create(@Payload() createPlayerDto: CreatePlayerDto, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      await this.playerService.create(createPlayerDto);

      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckErrors = ackErrors.filter((ackError) => error.message.includes(ackError));

      if (filterAckErrors) {
        await channel.ack(originalMsg);
      }

      throw new BadRequestException(error.message);
    }
  }

  @EventPattern('update-player')
  async update(@Payload() updatePlayer: any, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      const id: string = updatePlayer.id;

      const player = updatePlayer.player;

      await this.playerService.update(id, player);

      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckErrors = ackErrors.filter((ackError) => error.message.includes(ackError));

      if (filterAckErrors) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('delete-player')
  async remove(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      await this.playerService.delete(id);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
