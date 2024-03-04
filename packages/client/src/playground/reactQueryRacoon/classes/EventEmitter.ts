export class EventEmitter<T> {
  // Event type to event listeners map.
  private listeners: Map<keyof T, ((data: any) => void)[]> = new Map();
  // Queue of events that were emitted before any listeners were attached.
  private eventQueue: Array<{ event: keyof T; data: any }> = [];

  // Add a listener for the given event.
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): () => void {
    let listeners = this.listeners.get(event);
    if (!listeners) {
      listeners = [];
      this.listeners.set(event, listeners);
    }
    listeners.push(listener as ((data: any) => void));

    // Immediately process any queued events for this type.
    this.eventQueue = this.eventQueue.filter(queuedEvent => {
      if (queuedEvent.event === event) {
        listener(queuedEvent.data);
        return false; // remove from queue after processing
      }
      return true;
    });

    // Return an unsubscribe function.
    return () => {
      const currentListeners = this.listeners.get(event);
      if (currentListeners) {
        this.listeners.set(event, currentListeners.filter(l => l !== listener));
      }
    };
  }

  // Emit an event with the given data payload.
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const listeners = this.listeners.get(event);
    if (listeners?.length) {
      for (const listener of listeners) {
        listener(data);
      }
    } else {
      // No listeners, so queue the event for later.
      this.eventQueue.push({ event, data });
    }
  }
}
