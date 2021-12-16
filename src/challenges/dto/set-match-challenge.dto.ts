import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IResult } from '../interfaces/challenge.interface';

export class SetMatchChallengeDto {
  @IsNotEmpty()
  @IsString()
  winPlayer: string;

  @IsNotEmpty()
  @IsArray()
  result: Array<IResult>;
}
