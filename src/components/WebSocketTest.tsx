import { useState } from 'react';
import { useWebSocket } from '@/sockets/socket';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function WebSocketTest() {
    const [testConversationId] = useState('test-conversation-123');
    const [lastEvent, setLastEvent] = useState<any>(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    
    const { 
        connect, 
        disconnect, 
        subscribeToConversation, 
        unsubscribeFromConversation, 
        isConnected, 
        connectionState,
        getActiveSubscriptions
    } = useWebSocket();

    const handleConnect = async () => {
        try {
            await connect();
            console.log('WebSocket connected successfully');
        } catch (error) {
            console.error('Failed to connect:', error);
        }
    };

    const handleDisconnect = () => {
        disconnect();
        console.log('WebSocket disconnected');
    };

    const handleSubscribe = () => {
        const success = subscribeToConversation(testConversationId, (event) => {
            console.log('Test event received:', event);
            setLastEvent(event);
        });
        
        if (success) {
            setIsSubscribed(true);
            console.log('Subscribed to test conversation');
        } else {
            console.error('Failed to subscribe');
        }
    };

    const handleUnsubscribe = () => {
        const success = unsubscribeFromConversation(testConversationId);
        
        if (success) {
            setIsSubscribed(false);
            setLastEvent(null);
            console.log('Unsubscribed from test conversation');
        } else {
            console.error('Failed to unsubscribe');
        }
    };

    const sendTestMessage = () => {
        // This would typically be sent from the server
        // For testing, we'll simulate receiving a message
        const testEvent = {
            type: 'conversationEvent',
            id: 'test-event-' + Date.now(),
            conversationID: testConversationId,
            message: {
                status: 'delivered',
                body: {
                    type: 'text',
                    text: 'Test message from WebSocket!'
                }
            },
            actorID: 'test-agent',
            actorType: 'agent',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        // Simulate receiving the message
        setLastEvent(testEvent);
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>WebSocket Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                        Status: <span className="font-mono">{connectionState}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Connected: <span className="font-mono">{isConnected() ? 'Yes' : 'No'}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Subscribed: <span className="font-mono">{isSubscribed ? 'Yes' : 'No'}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Active Subscriptions: <span className="font-mono">{getActiveSubscriptions().join(', ') || 'None'}</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleConnect} disabled={isConnected()}>
                        Connect
                    </Button>
                    <Button onClick={handleDisconnect} disabled={!isConnected()}>
                        Disconnect
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button 
                        onClick={handleSubscribe} 
                        disabled={!isConnected() || isSubscribed}
                        variant="outline"
                    >
                        Subscribe
                    </Button>
                    <Button 
                        onClick={handleUnsubscribe} 
                        disabled={!isConnected() || !isSubscribed}
                        variant="outline"
                    >
                        Unsubscribe
                    </Button>
                </div>

                <Button 
                    onClick={sendTestMessage} 
                    disabled={!isSubscribed}
                    variant="secondary"
                >
                    Send Test Message
                </Button>

                {lastEvent && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-md">
                        <p className="text-sm font-medium mb-2">Last Event:</p>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(lastEvent, null, 2)}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 