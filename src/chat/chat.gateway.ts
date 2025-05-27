// chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private users: { [userId: number]: Set<string> } = {};
  private server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    const userId = parseInt(client.handshake.query.userId as string);
    if (!isNaN(userId)) {
      if (!this.users[userId]) {
        this.users[userId] = new Set();
      }
      this.users[userId].add(client.id);
      console.log(`User ${userId} connected with socket ${client.id}`);
    } else {
      console.log('Connection rejected: missing or invalid userId');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userIdStr, socketSet] of Object.entries(this.users)) {
      socketSet.delete(client.id);
      if (socketSet.size === 0) {
        delete this.users[+userIdStr];
        console.log(`User ${userIdStr} fully disconnected`);
      }
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    payload: { senderId: number; receiverId: number; content: string },
  ) {
    const message = await this.chatService.saveMessage(payload);

    const receiverSockets = this.users[payload.receiverId];
    const senderSockets = this.users[payload.senderId];

    // Send message to receiver
    if (receiverSockets) {
      for (const socketId of receiverSockets) {
        this.server.to(socketId).emit('receiveMessage', message);

        const unreadCount = await this.chatService.getUnreadCount(payload.receiverId);
        this.server
          .to(socketId)
          .emit('unreadCount', { from: payload.senderId, count: unreadCount });
      }
    }

    // Send message to sender (confirmation/update)
    if (senderSockets) {
      for (const socketId of senderSockets) {
        this.server.to(socketId).emit('receiveMessage', message);
      }
    }

    return message;
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    @MessageBody() payload: { userId: number; partnerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.getMessagesBetweenUsers(
      payload.userId,
      payload.partnerId,
    );
    client.emit('messageHistory', messages);
  }
}
