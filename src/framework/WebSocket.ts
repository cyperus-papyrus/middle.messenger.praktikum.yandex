export default class WebSocketService {
    private socket: WebSocket | null = null;
    private pingInterval: number | null = null;
    private readonly pingIntervalTime = 50000;
    private messageListeners: ((data: unknown) => void)[] = [];
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 5;
    private url: string;
    private handlers: {
        onOpen?: () => void;
        onClose?: () => void;
        onError?: (event: Event) => void;
    };

    constructor(url: string, handlers: {
        onOpen?: () => void;
        onClose?: () => void;
        onError?: (event: Event) => void;
    }) {
        this.url = url;
        this.handlers = handlers;
        this.connect();
    }

    private connect() {
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener('open', () => {
            this.reconnectAttempts = 0;
            this.handlers.onOpen?.();
            this.setupPing();
        });

        this.socket.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                this.messageListeners.forEach(listener => listener(data));
            } catch (e) {
                console.warn('Non-JSON message received:', event.data, e);

                const messagePayload = {
                    type: 'error',
                    content: event.data
                };

                this.messageListeners.forEach(listener => listener(messagePayload));
            }
        });

        this.socket.addEventListener('close', () => {
            this.handlers.onClose?.();
            this.cleanup();
            this.tryReconnect();
        });

        this.socket.addEventListener('error', (event) => {
            this.handlers.onError?.(event);
            this.cleanup();
        });
    }

    private setupPing() {
        this.pingInterval = window.setInterval(() => {
            if (this.socket?.readyState === WebSocket.OPEN) {
                this.send({ type: 'ping' });
            }
        }, this.pingIntervalTime);
    }

    send(data: Record<string, unknown>) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
            return true;
        }
        return false;
    }

    addMessageListener(listener: (data: unknown) => void) {
        this.messageListeners.push(listener);
    }

    removeMessageListener(listener: (data: unknown) => void) {
        this.messageListeners = this.messageListeners.filter(l => l !== listener);
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
        this.cleanup();
    }

    private cleanup() {
        if (this.pingInterval !== null) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
        this.messageListeners = [];
    }
    removeAllListeners() {
        this.messageListeners = [];
    }
    private tryReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.connect(), 3000 * this.reconnectAttempts);
        }
    }
}
