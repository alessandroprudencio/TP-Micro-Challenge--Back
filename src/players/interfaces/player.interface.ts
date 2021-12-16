import { Document } from 'mongoose';
import { ICategory } from 'src/categories/interfaces/category.interface';

export interface IPlayer extends Document {
  phoneNumber: string;
  email: string;
  name: string;
  ranking: string;
  positionRanking: number;
  category: ICategory;
}
