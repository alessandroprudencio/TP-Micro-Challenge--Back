import { IResult } from './result.interface';

export interface IMatch extends Document {
  winPlayer: string;
  result: Array<IResult>;
}
