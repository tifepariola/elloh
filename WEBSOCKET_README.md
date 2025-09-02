# WebSocket Implementation

This project now includes a comprehensive WebSocket implementation for real-time conversation events.

## Features

- **Real-time Updates**: Subscribe to conversation events and receive instant updates
- **Automatic Reconnection**: Handles connection drops with exponential backoff
- **Token-based Authentication**: Uses JWT tokens for secure WebSocket connections
- **Fallback Polling**: Falls back to HTTP polling when WebSocket is unavailable
- **Connection Management**: Automatic connection lifecycle management

## Architecture

### WebSocket Service (`src/sockets/socket.ts`)

The core WebSocket service that handles:
- Connection management
- Message handling
- Subscription management
- Automatic reconnection
- Event routing

### WebSocket Manager (`src/components/WebSocketManager.tsx`)

A React component that manages the global WebSocket connection:
- Automatically connects when user is authenticated
- Disconnects when user logs out
- Manages connection lifecycle

### ChatWindow Integration

The ChatWindow component automatically:
- Subscribes to conversation events when opened
- Unsubscribes when closed or conversation changes
- Updates UI in real-time when events are received
- Shows connection status (Live/Offline)

## Usage

### Basic WebSocket Connection

```typescript
import { useWebSocket } from '@/sockets/socket';

function MyComponent() {
  const { connect, disconnect, isConnected } = useWebSocket();

  const handleConnect = async () => {
    try {
      await connect();
      console.log('Connected!');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  return (
    <div>
      <p>Status: {isConnected() ? 'Connected' : 'Disconnected'}</p>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

### Subscribing to Conversation Events

```typescript
import { useWebSocket, ConversationEvent } from '@/sockets/socket';

function ChatComponent({ conversationId }: { conversationId: string }) {
  const { subscribeToConversation, unsubscribeFromConversation } = useWebSocket();

  useEffect(() => {
    // Subscribe to conversation events
    const success = subscribeToConversation(conversationId, (event: ConversationEvent) => {
      console.log('New message:', event);
      // Handle the event (e.g., update UI, refresh messages)
    });

    if (!success) {
      console.error('Failed to subscribe');
    }

    // Cleanup: unsubscribe when component unmounts
    return () => {
      unsubscribeFromConversation(conversationId);
    };
  }, [conversationId]);

  return <div>Chat content...</div>;
}
```

## API Endpoints

### WebSocket Connection
```
ws://your-api-domain/api/v1/ws?token=YOUR_JWT_TOKEN
```

### Subscription Message Format

**Subscribe to conversation events:**
```json
{
  "type": "subscription",
  "action": "subscribe",
  "topic": "conversationEvent",
  "resourceID": "conversation-id-here"
}
```

**Unsubscribe from conversation events:**
```json
{
  "type": "subscription",
  "action": "unsubscribe",
  "topic": "conversationEvent",
  "resourceID": "conversation-id-here"
}
```

### Event Message Format

**Received conversation event:**
```json
{
  "type": "conversationEvent",
  "id": "event-id",
  "conversationID": "conversation-id",
  "message": {
    "status": "delivered",
    "body": {
      "type": "text",
      "text": "Message content"
    }
  },
  "actorID": "agent-id",
  "actorType": "agent",
  "updatedAt": "2024-01-01T00:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Environment Configuration

Set the following environment variable:

```bash
VITE_API_URL=https://your-api-domain.com
```

The WebSocket service will automatically convert HTTP/HTTPS to WS/WSS.

## Testing

You can test the WebSocket functionality in the Settings page:

1. Navigate to `/settings`
2. Click on the "WebSocket" tab
3. Use the test interface to:
   - Connect/disconnect to WebSocket
   - Subscribe/unsubscribe to test conversations
   - Send test messages
   - Monitor connection status

## Error Handling

The WebSocket service includes comprehensive error handling:

- **Connection failures**: Automatic retry with exponential backoff
- **Authentication errors**: Automatic disconnection and cleanup
- **Message parsing errors**: Graceful degradation with logging
- **Network issues**: Automatic reconnection attempts

## Fallback Strategy

When WebSocket is unavailable, the system automatically falls back to HTTP polling:

- Polls for new messages every 3 seconds
- Seamlessly switches between real-time and polling modes
- Maintains user experience regardless of connection status

## Security

- **Token-based authentication**: Uses JWT tokens from the auth context
- **Secure WebSocket**: Automatically uses WSS when HTTPS is configured
- **Connection validation**: Validates authentication before establishing connection
- **Automatic cleanup**: Disconnects and cleans up on logout

## Performance Considerations

- **Efficient subscriptions**: Only subscribes to active conversations
- **Automatic cleanup**: Unsubscribes when conversations are closed
- **Connection pooling**: Single WebSocket connection for all subscriptions
- **Memory management**: Proper cleanup of event handlers and subscriptions 