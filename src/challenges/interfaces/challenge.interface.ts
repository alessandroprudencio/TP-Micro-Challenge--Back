import { IChallengeStatus } from './challenge-status.enum.interface';
import { IMatch } from './match.interface';

export interface IChallenge extends Document {
  readonly _id: string;
  requester: string;
  dateTimeChallenge: Date;
  dateTimeResponse: Date;
  message: string;
  status: IChallengeStatus;
  category: string;
  players: Array<string>;
  match?: IMatch;
}
