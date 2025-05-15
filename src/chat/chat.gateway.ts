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

interface UserSocketMap {
  [userId: number]: string; // userId -> socket.id
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private users: UserSocketMap = {};
  private server: Server;

  constructor(private chatService: ChatService) {}

  afterInit(server: Server) {
    this.server = server;
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    const userId = parseInt(client.handshake.query.userId as string);
    if (!isNaN(userId)) {
      this.users[userId] = client.id;
      console.log(`User ${userId} connected with socket ${client.id}`);
    } else {
      console.log('Invalid connection: no userId provided');
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Object.keys(this.users).find((key) => this.users[+key] === client.id);
    if (userId) {
      console.log(`User ${userId} disconnected`);
      delete this.users[+userId];
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() payload: { senderId: number; receiverId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.saveMessage(payload); // Save in DB

    const receiverSocketId = this.users[payload.receiverId];
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receiveMessage', message); // Send to recipient
    }

    // Also return back to sender (to render locally)
    client.emit('receiveMessage', message);

    return message;
  }

  @SubscribeMessage('getMessages')
async handleGetMessages(
  @MessageBody() payload: { userId: number; partnerId: number },
  @ConnectedSocket() client: Socket,
) {
  const messages = await this.chatService.getMessagesBetweenUsers(payload.userId, payload.partnerId);
  client.emit('messageHistory', messages);
}

}
