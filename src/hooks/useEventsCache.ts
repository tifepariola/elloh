import { listEvents } from '@/api';
import { eventsCache } from '@/store/eventsCache';
import { Event } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useEventsCache = (conversationId: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastEventCountRef = useRef<number>(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load events from cache or fetch from API
  const loadEvents = useCallback(async (forceRefresh = false) => {
    if (!conversationId) return;

    // Check cache first (unless forcing refresh)
    if (!forceRefresh) {
      const cachedEvents = eventsCache.getEvents(conversationId);
      if (cachedEvents) {
        setEvents(cachedEvents);
        setIsLoading(false);
        setError(null);
        return;
      }
    }

    // Set loading state
    setIsLoading(true);
    setError(null);
    eventsCache.setLoading(conversationId, true);

    try {
      const response = await listEvents(conversationId);
      const sortedEvents = response.events?.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ) || [];

      // Update cache and state
      eventsCache.setEvents(conversationId, sortedEvents);
      setEvents(sortedEvents);
      
      // Track if we got new events to adjust polling frequency
      if (sortedEvents.length > lastEventCountRef.current) {
        // New messages received - poll more frequently
        adjustPollingFrequency(500); // Poll every 500ms when active
      } else {
        // No new messages - gradually increase interval
        adjustPollingFrequency(1000); // Back to 1 second
      }
      
      lastEventCountRef.current = sortedEvents.length;
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load messages');
      
      // If we have cached data, use it even if it's stale
      const cachedEvents = eventsCache.getEvents(conversationId);
      if (cachedEvents) {
        setEvents(cachedEvents);
      }
    } finally {
      setIsLoading(false);
      eventsCache.setLoading(conversationId, false);
    }
  }, [conversationId]);

  // Adjust polling frequency based on activity
  const adjustPollingFrequency = useCallback((interval: number) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    pollingIntervalRef.current = setInterval(() => {
      if (!isLoading && conversationId) {
        loadEvents();
      }
    }, interval);
  }, [conversationId, isLoading, loadEvents]);

  // Add a new event to the cache and state
  const addEvent = useCallback((event: Event) => {
    eventsCache.addEvent(conversationId, event);
    setEvents(prev => [...prev, event]);
    lastEventCountRef.current += 1;
  }, [conversationId]);

  // Update an existing event
  const updateEvent = useCallback((eventId: string, updatedEvent: Event) => {
    eventsCache.updateEvent(conversationId, eventId, updatedEvent);
    setEvents(prev => 
      prev.map(event => event.id === eventId ? updatedEvent : event)
    );
  }, [conversationId]);

  // Refresh events (force fetch from API)
  const refreshEvents = useCallback(() => {
    loadEvents(true);
  }, [loadEvents]);

  // Clear cache for this conversation
  const clearCache = useCallback(() => {
    eventsCache.clearConversation(conversationId);
    setEvents([]);
    lastEventCountRef.current = 0;
  }, [conversationId]);

  // Load events when conversation changes
  useEffect(() => {
    loadEvents();
    lastEventCountRef.current = 0;
  }, [loadEvents]);

  // Set up WebSocket listeners for real-time updates
//   useEffect(() => {
//     if (!conversationId) return;

//     // Connect to socket if not connected
//     if (!socket.connected) {
//       socket.connect();
//     }

//     // Listen for new events in this conversation
//     const handleNewEvent = (data: { conversationId: string; event: Event }) => {
//       if (data.conversationId === conversationId) {
//         addEvent(data.event);
//       }
//     };

//     // Listen for event updates
//     const handleEventUpdate = (data: { conversationId: string; eventId: string; event: Event }) => {
//       if (data.conversationId === conversationId) {
//         updateEvent(data.eventId, data.event);
//       }
//     };

//     // Join conversation room for real-time updates
//     socket.emit('join-conversation', { conversationId });

//     // Set up event listeners
//     socket.on('new-event', handleNewEvent);
//     socket.on('event-update', handleEventUpdate);

//     return () => {
//       // Leave conversation room
//       socket.emit('leave-conversation', { conversationId });
      
//       // Remove event listeners
//       socket.off('new-event', handleNewEvent);
//       socket.off('event-update', handleEventUpdate);
//     };
//   }, [conversationId, addEvent, updateEvent]);

  // Set up intelligent polling for new messages (fallback)
  useEffect(() => {
    // Start with frequent polling (500ms) for active conversations
    adjustPollingFrequency(500);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [conversationId, adjustPollingFrequency]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

  return {
    events,
    isLoading,
    error,
    addEvent,
    updateEvent,
    refreshEvents,
    clearCache,
    loadEvents
  };
}; 