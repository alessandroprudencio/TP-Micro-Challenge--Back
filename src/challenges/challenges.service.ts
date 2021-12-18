import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from 'src/players/schemas/player.schema';
import { ClientProxyRabbitMq } from 'src/proxyrmq/client-proxy';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { SetScoreChallengeDto } from './dto/set-score-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { IChallengeStatus } from './interfaces/challenge-status.enum.interface';
import { IChallenge } from './interfaces/challenge.interface';
import { IPlayer } from './interfaces/player.interface';
import { Challenge, ChallengeDocument } from './schemas/challenge.schema';
import * as moment from 'moment';

moment.locale('pt-br');

@Injectable()
export class ChallengesService {
  private clientRabbitMQNotification = this.clientProxy.getClientProxyRabbitmq('micro-notification-back');

  constructor(
    @InjectModel(Challenge.name)
    private readonly challengeModel: Model<ChallengeDocument>,

    private clientProxy: ClientProxyRabbitMq,

    // @InjectModel(Match.name)
    // private readonly matchModel: Model<MatchDocument>,

    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async create(createChallengeDto: CreateChallengeDto): Promise<void> {
    const { dateTimeChallenge, requester, players } = createChallengeDto;

    // Pega todos os jogadores do desafio
    const allPlayers = await this.playerModel.find().populate('category', '_id name description');

    if (allPlayers.length < 2) throw new InternalServerErrorException(`Challenge players not found`);

    const requesterCategory = allPlayers.find((item) => item._id == requester)?.category;

    if (!requesterCategory) throw new RpcException(`Player without category`);

    players.map((playerDto) => {
      const player = allPlayers.find((player) => player._id == playerDto._id);

      if (!player) throw new RpcException(`The id ${playerDto._id} is not player`);

      // Não pode criar desafio se não perterncer a mesma categoria
      if (player.category._id !== requesterCategory._id) {
        throw new RpcException(`It is not allowed to challenge player of another category`);
      }
    });

    // Verifica se o solicitante é um dos jogadores da partida
    const isPlayerChallenge = players.filter((item: IPlayer) => item._id == requester);

    if (isPlayerChallenge.length === 0) throw new RpcException('Requester must be a player of the match');

    // Verifica se o solicitante já tem desafio na data informada

    const IsExistChallenge = await this.challengeModel
      .findOne({ dateTimeChallenge })
      .where('status', IChallengeStatus.ACEITO)
      .where('requester', requester);

    if (IsExistChallenge)
      throw new RpcException(
        `This player already has a challenge with id ${IsExistChallenge.id} on this date: ${dateTimeChallenge}`,
      );

    const resp = await this.challengeModel.create({
      ...createChallengeDto,
      category: requesterCategory._id,
    });

    // send notification
    this.sendNotificationOpponent(resp);
  }

  private async sendNotificationOpponent(challenge: IChallenge) {
    const requestPlayer = await this.playerModel.findById(challenge.requester);
    // const opponentPlayer = await this.playerModel.findById(challenge.players[1]);

    const date = moment(challenge.dateTimeChallenge).format('llll');

    const notification = {
      requestPlayer,
      date,
    };

    this.clientRabbitMQNotification.emit('create-notification-challenge', notification);
  }

  async update(id: string, updateChallengeDto: UpdateChallengeDto): Promise<IChallenge> {
    const challenge = await this.foundChallengeById(id);

    if (challenge.status !== IChallengeStatus.PENDENTE)
      throw new RpcException('Only status with PENDENTE challenge can be signed');

    if (updateChallengeDto.status) {
      challenge.dateTimeResponse = new Date();
    }

    challenge.status = updateChallengeDto.status;

    challenge.dateTimeChallenge = updateChallengeDto.dateTimeChallenge;

    return await this.challengeModel.findByIdAndUpdate(id, updateChallengeDto);
  }

  async findOne(id: string): Promise<IChallenge> {
    return await this.foundChallengeById(id);
  }

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

  async delete(id: string): Promise<void> {
    await this.foundChallengeById(id);

    await this.challengeModel.deleteOne({ id });
  }

  private async foundChallengeById(id: string): Promise<IChallenge> {
    const foundChallenge = await this.challengeModel.findById(id).populate('players', '_id name avatar');

    if (!foundChallenge) throw new NotFoundException(`Chanllenge with id ${id} not found`);

    return foundChallenge;
  }

  async findChallengesPlayer(playerId: string): Promise<IChallenge[]> {
    return await this.challengeModel.find().where('players', playerId);
  }

  async setScore(id: string, setScoreChallengeDto: SetScoreChallengeDto): Promise<void> {
    // CREATE NEW MATCH WHEN MATCH IS FINALLY

    const challenge = await this.foundChallengeById(id);

    const { winPlayer, result } = setScoreChallengeDto;

    // Verificar se o jogador vencedor faz parte do desafio
    const checkWinPlayer = challenge.players.find((item) => item.toString() === winPlayer);

    if (!checkWinPlayer) throw new RpcException(`Winning player is not part of this challenge`);

    if (challenge.status === IChallengeStatus.REALIZADO)
      throw new RpcException(`The match has already been played, it is not possible to change the result`);

    if (challenge.status !== IChallengeStatus.ACEITO)
      throw new RpcException(
        `It is not possible to enter the result of the challenge, if it has not been accepted yet`,
      );

    // altera o status para finalizar e seta o placar
    const newChallenge = {
      status: IChallengeStatus.REALIZADO,
      match: {
        winPlayer,
        result,
      },
    };

    await this.challengeModel.findByIdAndUpdate(id, newChallenge);
  }
}
