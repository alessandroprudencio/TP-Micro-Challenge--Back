import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ICategory } from 'src/categories/interfaces/category.interface';

export class UpdatePlayerDto {
  @IsNotEmpty()
  category?: ICategory;

  @IsString()
  @IsOptional()
  pushToken?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
