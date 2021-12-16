import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from 'src/players/schemas/player.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';
import { IPlayer } from './interfaces/player.interface';
import { Challenge, ChallengeDocument } from './schemas/challenge.schema';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,

    // @InjectModel(Match.name)
    // private readonly matchModel: Model<MatchDocument>,

    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async create(createChallengeDto: CreateChallengeDto): Promise<IChallenge> {
    const { dateTimeChallenge, requester, players } = createChallengeDto;

    // Verifica se os jogadores informados estão cadastrados
    const allPlayers = await this.playerModel.find().populate('category', '_id name description');

    const requesterCategory = allPlayers.find((item) => item._id == requester)?.category;

    if (!requesterCategory) throw new BadRequestException(`Player without category`);

    players.map((playerDto) => {
      const player = allPlayers.find((player) => player._id == playerDto._id);

      if (!player) throw new BadRequestException(`The id ${playerDto._id} is not player`);

      // Não pode criar desafio se não perterncer a mesma categoria
      if (player.category._id !== requesterCategory._id) {
        throw new BadRequestException(`It is not allowed to challenge player of another category`);
      }
    });

    // Verifica se o solicitante é um dos jogadores da partida

    const isPlayerChallenge = players.filter((item: IPlayer) => item._id == requester);

    if (isPlayerChallenge.length === 0) throw new BadRequestException('Requester must be a player of the match');

    // Verifica se o solicitante já tem desafio na data informada

    const IsExistChallenge = await this.challengeModel.findOne({ dateTimeChallenge }).where('requester', requester);

    if (IsExistChallenge)
      throw new BadRequestException(`This player already has a challenge on this date: ${dateTimeChallenge}`);

    return await this.challengeModel.create({
      ...createChallengeDto,
      category: requesterCategory._id,
    });
  }

  // async update(
  //   id: string,
  //   updateChallengeDto: UpdateChallengeDto,
  // ): Promise<IChallenge> {
  //   const challenge = await this.foundChallengeById(id);

  //   if (updateChallengeDto.status) {
  //     challenge.dateTimeResponse = new Date();
  //   }

  //   challenge.status = updateChallengeDto.status;
  //   challenge.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

  //   return await this.challengeModel.findByIdAndUpdate(
  //     challenge.id,
  //     challenge,
  //     {
  //       returnOriginal: false,
  //     },
  //   );
  // }

  // async findOne(id: string): Promise<IChallenge> {
  //   return await this.foundChallengeById(id);
  // }

  async findAll(): Promise<IChallenge[]> {
    return await this.challengeModel
      .find()
      .populate('players', '_id name avatar')
      .populate('requester', '_id name avatar')
      .populate('category', '_id name')
      .populate({
        path: 'match',
        populate: { path: 'category', select: '_id name' },
      });
  }

  // async delete(id: string): Promise<any> {
  //   const challenge = await this.foundChallengeById(id);

  //   return await this.challengeModel.findByIdAndUpdate(challenge.id, {
  //     status: IChallengeStatus.CANCELADO,
  //   });
  // }

  // private async foundChallengeById(id: string): Promise<IChallenge> {
  //   const foundChallenge = await this.challengeModel
  //     .findById(id)
  //     .populate('players', '_id name avatar');

  //   if (!foundChallenge)
  //     throw new NotFoundException(`Chanllenge with id ${id} not found`);

  //   return foundChallenge;
  // }

  // async setMatchChallenge(
  //   id: string,
  //   setMatchChallengeDto: SetMatchChallengeDto,
  // ): Promise<IChallenge> {
  //   // CREATE NEW MATCH WHEN MATCH IS FINALLY

  //   const challenge = await this.foundChallengeById(id);

  //   const { winPlayer } = setMatchChallengeDto;

  //   // Verificar se o jogador vencedor faz parte do desafio
  //   const checkWinPlayer = challenge.players.find(
  //     (item) => item._id.toString() === winPlayer,
  //   );

  //   if (!checkWinPlayer)
  //     throw new BadRequestException(
  //       `Winning player is not part of this challenge`,
  //     );

  //   // Criar partida
  //   const match = new this.matchModel(setMatchChallengeDto);

  //   match.category = challenge.category;

  //   match.players = challenge.players;

  //   const result = await match.save();

  //   // quando a partida for registrada por um usuario, mudaremos o status do desafio para REALIZADO
  //   challenge.status = IChallengeStatus.REALIZADO;

  //   challenge.match = result._id;

  //   try {
  //     return await this.challengeModel.findByIdAndUpdate(id, challenge);
  //   } catch (error) {
  //     // se der erro removemos a partida criada anteriormente

  //     await this.matchModel.deleteOne({ id: result._id });

  //     throw new InternalServerErrorException();
  //   }
  // }
}
