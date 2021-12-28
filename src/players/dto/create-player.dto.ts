import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsNotEmpty()
  category: ICategory;

  @IsString()
  @IsOptional()
  pushToken?: string;
}
