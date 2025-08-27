import { Event } from "@/types";

interface EventsCache {
  [conversationId: string]: {
    events: Event[];
    lastFetched: number;
    isLoading: boolean;
  };
}

class EventsCacheStore {
  private cache: EventsCache = {};
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  // Get events from cache
  getEvents(conversationId: string): Event[] | null {
    const cached = this.cache[conversationId];
    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.lastFetched > this.cacheExpiry) {
      delete this.cache[conversationId];
      return null;
    }

    return cached.events;
  }

  // Set events in cache
  setEvents(conversationId: string, events: Event[]): void {
    this.cache[conversationId] = {
      events,
      lastFetched: Date.now(),
      isLoading: false
    };
  }

  // Set loading state
  setLoading(conversationId: string, isLoading: boolean): void {
    if (!this.cache[conversationId]) {
      this.cache[conversationId] = {
        events: [],
        lastFetched: Date.now(),
        isLoading
      };
    } else {
      this.cache[conversationId].isLoading = isLoading;
    }
  }

  // Check if conversation is loading
  isLoading(conversationId: string): boolean {
    return this.cache[conversationId]?.isLoading || false;
  }

  // Add a single event to cache (for new messages)
  addEvent(conversationId: string, event: Event): void {
    if (this.cache[conversationId]) {
      // Check if event already exists to avoid duplicates
      const existingEvent = this.cache[conversationId].events.find(e => e.id === event.id);
      if (!existingEvent) {
        this.cache[conversationId].events.push(event);
        this.cache[conversationId].lastFetched = Date.now();
      }
    }
  }

  // Update an existing event in cache
  updateEvent(conversationId: string, eventId: string, updatedEvent: Event): void {
    if (this.cache[conversationId]) {
      const index = this.cache[conversationId].events.findIndex(e => e.id === eventId);
      if (index !== -1) {
        this.cache[conversationId].events[index] = updatedEvent;
        this.cache[conversationId].lastFetched = Date.now();
      }
    }
  }

  // Add multiple events to cache (for bulk updates)
  addEvents(conversationId: string, newEvents: Event[]): void {
    if (this.cache[conversationId]) {
      const existingIds = new Set(this.cache[conversationId].events.map(e => e.id));
      const uniqueNewEvents = newEvents.filter(event => !existingIds.has(event.id));
      
      if (uniqueNewEvents.length > 0) {
        this.cache[conversationId].events.push(...uniqueNewEvents);
        this.cache[conversationId].lastFetched = Date.now();
      }
    }
  }

  // Clear cache for a specific conversation
  clearConversation(conversationId: string): void {
    delete this.cache[conversationId];
  }

  // Clear all cache
  clearAll(): void {
    this.cache = {};
  }

  // Get cache size (for debugging)
  getCacheSize(): number {
    return Object.keys(this.cache).length;
  }

  // Get cache info (for debugging)
  getCacheInfo(): EventsCache {
    return { ...this.cache };
  }
}

// Create singleton instance
export const eventsCache = new EventsCacheStore(); 