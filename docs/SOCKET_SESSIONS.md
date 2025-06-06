# Socket.io Active Sessions Implementation

This implementation provides real-time tracking of active application sessions using Socket.io WebSocket connections.

## Features

- Real-time tracking of active WebSocket sessions
- REST API endpoints to get session counts and details
- Automatic session cleanup on disconnect
- User authentication support for sessions
- Broadcasting of session count updates to all connected clients

## Components

### 1. Socket.io Plugin (`src/plugins/socket.ts`)

The Socket.io plugin integrates WebSocket functionality into the Fastify server:

- **SessionManager Class**: Manages active sessions in memory
- **Socket.io Server**: Handles WebSocket connections and events
- **Session Tracking**: Automatically tracks connections, disconnections, and user authentication

### 2. Sessions API Module (`src/modules/sessions/`)

REST API endpoints for session management:

- `GET /api/sessions/count` - Get the current number of active sessions
- `GET /api/sessions/` - Get detailed information about all active sessions

### 3. Test Interface (`public/socket-test.html`)

A simple HTML interface to test the Socket.io functionality.

## Socket.io Events

### Client → Server Events

- `authenticate` - Associate a user ID with the current session
  ```javascript
  socket.emit('authenticate', { userId: 'user123', token: 'jwt_token' });
  ```

- `getActiveSessionsCount` - Request current session count
  ```javascript
  socket.emit('getActiveSessionsCount', (count) => {
    console.log('Active sessions:', count);
  });
  ```

- `getActiveSessions` - Request detailed session information
  ```javascript
  socket.emit('getActiveSessions', (sessions) => {
    console.log('Session details:', sessions);
  });
  ```

### Server → Client Events

- `activeSessionsCount` - Broadcasted when session count changes
  ```javascript
  socket.on('activeSessionsCount', (count) => {
    console.log('Updated session count:', count);
  });
  ```

## REST API Endpoints

### Get Active Sessions Count

```http
GET /api/sessions/count
```

**Response:**
```json
{
  "message": "Active sessions count retrieved successfully",
  "data": {
    "activeSessionsCount": 5,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Get Active Sessions Details

```http
GET /api/sessions/
```

**Response:**
```json
{
  "message": "Active sessions retrieved successfully",
  "data": {
    "sessions": [
      {
        "id": "socket_id_123",
        "userId": "user_456",
        "connectedAt": "2024-01-15T10:25:00.000Z",
        "userAgent": "Mozilla/5.0...",
        "ipAddress": "192.168.1.100"
      }
    ],
    "totalCount": 1,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Setup and Usage

### 1. Dependencies

The following packages are required:
- `socket.io` - WebSocket server
- `fastify-plugin` - Fastify plugin wrapper

### 2. Environment Variables

Make sure your `.env` file includes:
```env
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
# ... other required variables
```

### 3. Testing

1. Start the server:
   ```bash
   npm run start:dev
   ```

2. Open the test interface:
   ```
   http://localhost:3000/socket-test.html
   ```

3. Use the REST API:
   ```bash
   curl http://localhost:3000/api/sessions/count
   curl http://localhost:3000/api/sessions/
   ```

## Architecture Notes

- **In-Memory Storage**: Sessions are stored in memory and will be lost on server restart
- **Horizontal Scaling**: For multiple server instances, consider using Redis adapter for Socket.io
- **Security**: The current implementation is basic; add proper authentication and authorization as needed
- **Performance**: The implementation is suitable for moderate traffic; optimize for high-traffic scenarios

## Future Enhancements

- Persistent session storage (Redis/Database)
- User-specific session management
- Session analytics and reporting
- Rate limiting and security measures
- Integration with existing JWT authentication 