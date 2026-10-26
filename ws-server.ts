import { WebSocketServer, WebSocket } from 'ws';

// Start WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' });

// Type definition for incoming messages
interface ScorePayload {
  quizId: string;
  points: number;
  userName: string;
  userEmail: string;
}

interface IncomingMessage {
  type: 'NEW_SCORE';
  payload: ScorePayload;
}

wss.on('connection', (ws: WebSocket) => {
  console.log('🔗 A client connected to WebSocket');

  ws.on('message', (message: string) => {
    try {
      const data: IncomingMessage = JSON.parse(message);
      
      // If a new score is saved, broadcast it to all connected clients
      if (data.type === 'NEW_SCORE') {
        console.log('📢 New score received, broadcasting:', data.payload);
        
        wss.clients.forEach((client: WebSocket) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'SCORE_UPDATE', payload: data.payload }));
          }
        });
      }
    } catch (error) {
      console.error('Error processing incoming message:', error);
    }
  });
});

console.log('🚀 WebSocket server is running on port 8080...');