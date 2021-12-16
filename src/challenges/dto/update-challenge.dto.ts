import { IsDateString, IsOptional, IsString } from 'class-validator';
import { IChallengeStatus } from '../interfaces/challenge-status.enum.interface';

export class UpdateChallengeDto {
  @IsDateString()
  @IsOptional()
  dateTimeChallenge: Date;

  @IsString()
  @IsOptional()
  status: IChallengeStatus;
}
