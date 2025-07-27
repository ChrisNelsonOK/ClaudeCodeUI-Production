// Production-ready real-time collaboration system
import { useEffect, useState, useCallback, useRef } from 'react';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface Collaborator {
  id: string;
  name: string;
  cursor?: { x: number; y: number };
  selection?: { start: number; end: number };
  color: string;
  lastSeen: number;
}

interface CollaborationEvent {
  id: string;
  type: 'cursor' | 'selection' | 'edit' | 'join' | 'leave';
  userId: string;
  data: any;
  timestamp: number;
}

interface EditEvent {
  id: string;
  file: string;
  changes: {
    start: number;
    end: number;
    text: string;
  }[];
  userId: string;
  timestamp: number;
}

interface WebRTCConnection {
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel;
  connected: boolean;
}

export class CollaborationService {
  private socket: WebSocket | null = null;
  private connections: Map<string, WebRTCConnection> = new Map();
  private eventHandlers: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private roomId: string, private userId: string) {
    this.initializeWebSocket();
    this.setupWebRTC();
  }

  private initializeWebSocket() {
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/collaboration/${this.roomId}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('Connected to collaboration server');
      this.reconnectAttempts = 0;
      this.sendEvent('join', { userId: this.userId });
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleIncomingEvent(data);
    };

    this.socket.onclose = () => {
      console.log('Disconnected from collaboration server');
      this.attemptReconnection();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private setupWebRTC() {
    // WebRTC setup for peer-to-peer connections
    this.createPeerConnection();
  }

  private createPeerConnection(): RTCPeerConnection {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    return new RTCPeerConnection(configuration);
  }

  private attemptReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.initializeWebSocket();
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    }
  }

  private handleIncomingEvent(event: CollaborationEvent) {
    const handlers = this.eventHandlers.get(event.type) || [];
    handlers.forEach(handler => handler(event));
  }

  public sendEvent(type: string, data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const event: CollaborationEvent = {
        id: crypto.randomUUID(),
        type: type as any,
        userId: this.userId,
        data,
        timestamp: Date.now()
      };

      this.socket.send(JSON.stringify(event));
    }
  }

  public sendEdit(file: string, changes: any[]) {
    const editEvent: EditEvent = {
      id: crypto.randomUUID(),
      file,
      changes,
      userId: this.userId,
      timestamp: Date.now()
    };

    this.sendEvent('edit', editEvent);
  }

  public sendCursor(position: { x: number; y: number }) {
    this.sendEvent('cursor', { position });
  }

  public sendSelection(selection: { start: number; end: number }) {
    this.sendEvent('selection', { selection });
  }

  public on(eventType: string, handler: Function) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)!.push(handler);
  }

  public off(eventType: string, handler: Function) {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  public async getCollaborators(): Promise<Collaborator[]> {
    const response = await fetch(`${API_BASE_URL}/collaboration/${this.roomId}/users`);
    return response.json();
  }

  public async getRoomHistory(): Promise<CollaborationEvent[]> {
    const response = await fetch(`${API_BASE_URL}/collaboration/${this.roomId}/history`);
    return response.json();
  }

  public disconnect() {
    if (this.socket) {
      this.sendEvent('leave', { userId: this.userId });
      this.socket.close();
    }
    
    this.connections.forEach(connection => {
      connection.peerConnection.close();
    });
  }

  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// React hook for collaboration
export const useCollaboration = (roomId: string, userId: string) => {
  const [collaborationService] = useState(() => new CollaborationService(roomId, userId));
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<CollaborationEvent[]>([]);
  const [edits, setEdits] = useState<EditEvent[]>([]);

  useEffect(() => {
    const updateConnectionStatus = () => {
      setIsConnected(collaborationService.isConnected());
    };

    const handleCollaboratorUpdate = (event: CollaborationEvent) => {
      if (event.type === 'join' || event.type === 'leave') {
        collaborationService.getCollaborators().then(setCollaborators);
      }
    };

    const handleEditEvent = (event: CollaborationEvent) => {
      if (event.type === 'edit') {
        setEdits(prev => [...prev, event.data]);
      }
    };

    const handleEvent = (event: CollaborationEvent) => {
      setEvents(prev => [...prev, event]);
    };

    collaborationService.on('join', handleCollaboratorUpdate);
    collaborationService.on('leave', handleCollaboratorUpdate);
    collaborationService.on('edit', handleEditEvent);
    collaborationService.on('*', handleEvent);

    // Initial load
    collaborationService.getCollaborators().then(setCollaborators);
    collaborationService.getRoomHistory().then(setEvents);

    const interval = setInterval(updateConnectionStatus, 1000);

    return () => {
      clearInterval(interval);
      collaborationService.disconnect();
    };
  }, [collaborationService]);

  const sendEdit = useCallback((file: string, changes: any[]) => {
    collaborationService.sendEdit(file, changes);
  }, [collaborationService]);

  const sendCursor = useCallback((position: { x: number; y: number }) => {
    collaborationService.sendCursor(position);
  }, [collaborationService]);

  const sendSelection = useCallback((selection: { start: number; end: number }) => {
    collaborationService.sendSelection(selection);
  }, [collaborationService]);

  return {
    collaborators,
    isConnected,
    events,
    edits,
    sendEdit,
    sendCursor,
    sendSelection,
    on: collaborationService.on.bind(collaborationService),
    off: collaborationService.off.bind(collaborationService)
  };
};
