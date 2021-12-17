import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IResult } from '../interfaces/result.interface';

export class SetScoreChallengeDto {
  @IsNotEmpty()
  @IsString()
  winPlayer: string;

  @IsNotEmpty()
  @IsArray()
  result: Array<IResult>;
}
