export type EventHandler = (...args: unknown[]) => void;

export default class EventBus {
    private listeners: Record<string, EventHandler[]> = {};

    public on(event: string, callback: EventHandler): () => void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return () => {
            this.off(event, callback);
        };
    }

    public off(event: string, callback: EventHandler): void {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(
                (listener) => listener !== callback
            );
        } else {
            throw new Error(`Нет события: ${event}`);
        }
    }

    public emit(event: string, ...args: unknown[]): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        this.listeners[event].forEach((listener) => {
            listener(...args);
        });
    }
}
