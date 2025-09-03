import { useAuth } from '@/store/authContext';
import { useCallback } from 'react';

export interface WebSocketMessage {
  type: 'subscription';
  action: 'subscribe' | 'unsubscribe';
  topic: 'conversationEvent';
  resourceID: string;
}

export interface ConversationEvent {
  id: string;
  conversationID: string;
  type: string;
  message: {
    status: string;
    statusReason?: string;
    body: {
      type: string;
      text: string;
      image: {
        id: string;
        text?: string;
      };
    };
  };
  actorID: string;
  actorType: string;
  updatedAt: string;
  createdAt: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscriptions = new Set<string>();
  private eventHandlers = new Map<string, (event: ConversationEvent) => void>();
  private isConnecting = false;
  private baseUrl: string;

  constructor() {
    // Get base URL from environment or default to localhost
    this.baseUrl = "https://inboxdev-core-api.stack.internal.elloh.studio";
    // Convert HTTP/HTTPS to WS/WSS
    this.baseUrl = this.baseUrl.replace(/^http/, 'ws');
  }

  private getWebSocketUrl(token: string): string {
    return `${this.baseUrl}/api/v1/ws?token=${token}`;
  }

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Connection already in progress'));
        return;
      }

      this.isConnecting = true;

      try {
        const wsUrl = this.getWebSocketUrl(token);
        this.ws = new WebSocket(wsUrl);
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;

          // Resubscribe to all active subscriptions
          this.subscriptions.forEach(conversationId => {
            const handler = this.eventHandlers.get(conversationId);
            if (handler) {
              this.subscribeToConversation(conversationId, handler);
            }
          });

          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;

          if (event.code !== 1000) { // Not a normal closure
            this.handleReconnect(token);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        console.error('Failed to connect to WebSocket:', error);
        reject(error);
      }
    });
  }

  private handleReconnect(token: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect(token).catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  private handleMessage(data: any) {
    console.log('WebSocket message received:', data);

    if (data.type === 'conversationEvent') {
      const event = data.data as ConversationEvent;
      const conversationId = event.conversationID;
      const handler = this.eventHandlers.get(conversationId);
      if (handler) {
        console.log(`Handling event for conversation: ${conversationId}`);
        handler(data);
      } else {
        console.warn(`No handler found for conversation: ${conversationId}`);
      }
    } else {
      console.log('Unknown message type:', data.type);
    }
  }
  subscribeToConversation(conversationId: string, handler: (event: ConversationEvent) => void): boolean {
    this.eventHandlers.set(conversationId, handler);
  
    const message: WebSocketMessage = {
      type: 'subscription',
      action: 'subscribe',
      topic: 'conversationEvent',
      resourceID: conversationId,
    };
  
    try {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
        console.log(`Subscribed to conversation: ${conversationId}`);
      } else {
        console.log(`Queued subscription for: ${conversationId}`);
      }
  
      this.subscriptions.add(conversationId);
      return true;
    } catch (error) {
      console.error('Failed to subscribe to conversation:', error);
      return false;
    }
  }

  unsubscribeFromConversation(conversationId: string): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return false;
    }

    // Check if we're actually subscribed to this conversation
    if (!this.subscriptions.has(conversationId)) {
      console.log(`Not subscribed to conversation: ${conversationId}, skipping unsubscribe`);
      return true;
    }

    const message: WebSocketMessage = {
      type: 'subscription',
      action: 'unsubscribe',
      topic: 'conversationEvent',
      resourceID: conversationId
    };

    try {
      this.ws.send(JSON.stringify(message));
      this.subscriptions.delete(conversationId);
      this.eventHandlers.delete(conversationId);
      console.log(`Unsubscribed from conversation: ${conversationId}`);
      console.log(`Active subscriptions: ${Array.from(this.subscriptions).join(', ')}`);
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from conversation:', error);
      return false;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Normal closure');
      this.ws = null;
    }
    this.subscriptions.clear();
    this.eventHandlers.clear();
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return 'disconnected';

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'unknown';
    }
  }

  getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions);
  }
}

// Create a singleton instance
export const webSocketService = new WebSocketService();

// Hook for using WebSocket in components
export const useWebSocket = () => {
  const { token, isAuthenticated } = useAuth();

  const connect = async () => {
    if (!token || !isAuthenticated) {
      throw new Error('Authentication required');
    }
    return webSocketService.connect(token);
  };

  const subscribeToConversation = useCallback((conversationId: string, handler: (event: ConversationEvent) => void) => {

    return webSocketService.subscribeToConversation(conversationId, handler);
  }, [webSocketService]);

  const unsubscribeFromConversation = useCallback((conversationId: string) => {
    return webSocketService.unsubscribeFromConversation(conversationId);
  }, [webSocketService]);

  const disconnect = () => {
    webSocketService.disconnect();
  };

  const isConnected = () => {
    return webSocketService.isConnected();
  };

  const getConnectionState = () => {
    return webSocketService.getConnectionState();
  };

  const getActiveSubscriptions = () => {
    return webSocketService.getActiveSubscriptions();
  };

  return {
    connect,
    subscribeToConversation,
    unsubscribeFromConversation,
    disconnect,
    isConnected,
    getConnectionState,
    getActiveSubscriptions,
    connectionState: getConnectionState()
  };
};