import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { Player, PlayerDocument } from './schemas/player.schema';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>, // private categoriesService: CategoriesService,
  ) {
    this.playerModel = playerModel;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<void> {
    try {
      await this.playerModel.create(createPlayerDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto): Promise<IPlayer> {
    const player = await this.foundPlayerById(id);

    return await this.playerModel.findByIdAndUpdate(player.id, updatePlayerDto, {
      returnOriginal: false,
    });
  }

  async delete(id: string): Promise<any> {
    const player = await this.foundPlayerById(id);

    return await this.playerModel.deleteOne({ id: player.id });
  }

  async foundPlayerById(id: string): Promise<IPlayer> {
    try {
      return await this.playerModel.findById(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
