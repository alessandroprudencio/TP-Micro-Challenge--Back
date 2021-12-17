import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  score: number;

  // @IsArray()
  // @ArrayMinSize(1)
  // events: Array<Event>;
}

interface Event {
  name: string;
  operation: string;
  value: number;
}
