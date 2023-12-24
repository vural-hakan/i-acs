import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/entities';
import { UserService } from '../user/user.service';

import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CardEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardEntity]),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [CardController],
  providers: [CardService, UserService],
  exports: [CardService],
})
export class CardModule {}
