import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  // @IsArray()
  // @ArrayMinSize(1)
  // events: Array<Event>;
}

interface Event {
  name: string;
  operation: string;
  value: number;
}
