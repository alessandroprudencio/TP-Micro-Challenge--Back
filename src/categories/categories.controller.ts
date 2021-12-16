import { Controller, InternalServerErrorException } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ICategory } from './interfaces/category.interface';

const ackErrors: string[] = ['E11000'];

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @EventPattern('create-category')
  async create(@Payload() createCategoryDto: CreateCategoryDto, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      await this.categoryService.create(createCategoryDto);

      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckErrors = ackErrors.filter((ackError) => error.message.includes(ackError));

      if (filterAckErrors) {
        await channel.ack(originalMsg);
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  @EventPattern('update-category')
  async update(@Payload() updateCategory: any, @Ctx() context: RmqContext): Promise<void> {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      const id: string = updateCategory.id;

      const category: ICategory = updateCategory.category;

      await this.categoryService.update(id, category);

      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckErrors = ackErrors.filter((ackError) => error.message.includes(ackError));

      if (filterAckErrors) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('delete-category')
  async remove(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();

    const originalMsg = context.getMessage();

    try {
      await this.categoryService.delete(id);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
