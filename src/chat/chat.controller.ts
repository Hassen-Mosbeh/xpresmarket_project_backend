import { Controller, Get, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/v1/messages')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('between')
  async getMessagesBetween(
    @Query('user1') user1: number,
    @Query('user2') user2: number,
  ) {
    return this.chatService.getMessagesBetweenUsers(user1, user2);
  }
}
