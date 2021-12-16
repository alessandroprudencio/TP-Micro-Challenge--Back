import { IsNotEmpty } from 'class-validator';
import { ICategory } from 'src/categories/interfaces/category.interface';

export class UpdatePlayerDto {
  // @IsNotEmpty()
  // @IsString()
  // phoneNumber: string;

  // @IsNotEmpty()
  // @IsString()
  // name: string;

  // @IsObject()
  // avatar: string;

  @IsNotEmpty()
  category: ICategory;
}
