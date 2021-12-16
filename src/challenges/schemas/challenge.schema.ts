import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ICategory } from '../interfaces/category.interface';
import { IChallengeStatus } from '../interfaces/challenge-status.enum.interface';
import { IMatch } from '../interfaces/challenge.interface';
import { IPlayer } from '../interfaces/player.interface';
import { Match } from './match.schema';

export type ChallengeDocument = Challenge & Document;

@Schema({ timestamps: true, collection: 'challenges' })
export class Challenge {
  @Prop({ required: true })
  dateTimeChallenge: Date;

  @Prop()
  dateTimeResponse: Date;

  @Prop()
  message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  requester: string;

  @Prop({ default: IChallengeStatus.PENDENTE })
  status: IChallengeStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  category: ICategory;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  players: Array<IPlayer>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Match.name })
  match: IMatch;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
