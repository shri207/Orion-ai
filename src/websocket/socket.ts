import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let ioInstance: Server | null = null;

export const initWebSocket = (server: HttpServer) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['*'];

  const io = new Server(server, {
    cors: { origin: allowedOrigins }
  });
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`WebSocket Client Connected: ${socket.id}`);
    
    socket.on('joinInterview', (sessionId) => {
      socket.join(sessionId);
      console.log(`Socket ${socket.id} joined interview ${sessionId}`);
    });

    socket.on('answerReceived', (data) => {
      console.log(`Answer received on WS: ${data.sessionId}`);
    });

    socket.on('disconnect', () => {
      console.log(`WebSocket Client Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => ioInstance;
