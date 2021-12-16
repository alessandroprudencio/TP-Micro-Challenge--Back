import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'src/categories/categories.module';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { Player, PlayerSchema } from './schemas/player.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]), CategoriesModule],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService, MongooseModule],
})
export class PlayersModule {}
