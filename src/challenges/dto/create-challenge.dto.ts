import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { IPlayer } from '../interfaces/player.interface';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty()
  requester: string;

  @IsString()
  message: string;

  @IsDateString()
  @IsNotEmpty()
  dateTimeChallenge: Date;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Array<IPlayer>;
}
