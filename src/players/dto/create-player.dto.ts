import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ICategory } from 'src/categories/interfaces/category.interface';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsMongoId()
  _id: number;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  category: ICategory;
}
