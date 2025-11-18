import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
  namespace: 'events',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedUsers = new Map<string, Socket>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub;

      this.connectedUsers.set(userId, client);
      client.data.userId = userId;
      client.data.role = payload.role;

      // Join user to their personal room
      client.join(`user:${userId}`);
      
      // Join user to their school room
      if (payload.schoolId) {
        client.join(`school:${payload.schoolId}`);
      }

      // Join user to role-based rooms
      client.join(`role:${payload.role}`);

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
    }
  }

  // Send notification to specific user
  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  // Send notification to all users in a school
  sendToSchool(schoolId: string, event: string, data: any) {
    this.server.to(`school:${schoolId}`).emit(event, data);
  }

  // Send notification to all users with specific role
  sendToRole(role: string, event: string, data: any) {
    this.server.to(`role:${role}`).emit(event, data);
  }

  // Broadcast to all connected clients
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Attendance marked notification
  notifyAttendanceMarked(schoolId: string, data: any) {
    this.sendToSchool(schoolId, 'attendance:marked', data);
  }

  // New notice published
  notifyNewNotice(schoolId: string, data: any) {
    this.sendToSchool(schoolId, 'notice:new', data);
  }

  // Exam result published
  notifyExamResult(userId: string, data: any) {
    this.sendToUser(userId, 'exam:result', data);
  }

  // Fee payment received
  notifyFeePayment(userId: string, data: any) {
    this.sendToUser(userId, 'fee:payment', data);
  }

  // Leave status updated
  notifyLeaveStatus(userId: string, data: any) {
    this.sendToUser(userId, 'leave:status', data);
  }

  // New assignment posted
  notifyNewAssignment(schoolId: string, standard: string, data: any) {
    this.server.to(`school:${schoolId}`).emit('assignment:new', data);
  }

  // Homework submitted
  notifyHomeworkSubmitted(teacherId: string, data: any) {
    this.sendToUser(teacherId, 'homework:submitted', data);
  }

  // Event reminder
  notifyEventReminder(schoolId: string, data: any) {
    this.sendToSchool(schoolId, 'event:reminder', data);
  }

  // Emergency alert
  notifyEmergency(schoolId: string, data: any) {
    this.sendToSchool(schoolId, 'emergency:alert', data);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): any {
    return { event: 'message', data: 'Message received' };
  }

  @SubscribeMessage('join:room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
  }

  @SubscribeMessage('leave:room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
  }
}
