import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IResult } from '../interfaces/result.interface';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true, collection: 'matches' })
export class Match {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  winPlayer: string;

  @Prop()
  result: [Array<IResult>];
}

export const MatchSchema = SchemaFactory.createForClass(Match);
