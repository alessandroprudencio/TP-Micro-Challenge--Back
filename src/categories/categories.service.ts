import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ICategory } from './interfaces/category.interface';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    try {
      await this.categoryModel.create(createCategoryDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<void> {
    try {
      await this.foundCategoryById(id);

      await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
        returnOriginal: false,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<any> {
    await this.foundCategoryById(id);

    return await this.categoryModel.deleteOne({ id });
  }

  private async foundCategoryById(id: string): Promise<ICategory> {
    const foundCategory = await this.categoryModel.aggregate([
      {
        $lookup: {
          from: 'players',
          localField: '_id',
          foreignField: 'category',
          as: 'players',
        },
      },
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
    ]);

    if (foundCategory.length === 0) {
      throw new BadRequestException(`Category with id ${id} not found`);
    }

    return foundCategory[0];
  }
}
