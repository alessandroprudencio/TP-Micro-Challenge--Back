import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ICategory } from '../interfaces/category.interface';
import { IResult } from '../interfaces/challenge.interface';
import { IPlayer } from '../interfaces/player.interface';

export type MatchDocument = Match & Document;

@Schema({ timestamps: true, collection: 'matches' })
export class Match {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  winPlayer: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  category: ICategory;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }] })
  players: Array<IPlayer>;

  @Prop({ required: true })
  result: Array<IResult>;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
