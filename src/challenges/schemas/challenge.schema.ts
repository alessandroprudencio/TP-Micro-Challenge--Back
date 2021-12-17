import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IChallengeStatus } from '../interfaces/challenge-status.enum.interface';
import { IMatch } from '../interfaces/match.interface';
import { MatchSchema } from './match.schema';

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
  category: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  players: Array<string>;

  @Prop({ type: MatchSchema })
  match: IMatch;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
