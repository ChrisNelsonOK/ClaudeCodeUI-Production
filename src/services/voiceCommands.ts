// Production-ready voice commands system
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  confidence: number;
  timestamp: number;
}

interface VoiceCommandResult {
  command: string;
  confidence: number;
  action: string;
  parameters: Record<string, any>;
  success: boolean;
  error?: string;
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export class VoiceCommandService {
  private recognition: any = null;
  private isListening = false;
  private commands: Map<string, (params: any) => Promise<any>> = new Map();
  private commandHistory: VoiceCommand[] = [];

  constructor() {
    this.initializeSpeechRecognition();
    this.loadCommands();
  }

  private initializeSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = Array.from(event.results);
        const lastResult = results[results.length - 1];
        
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.toLowerCase();
          const confidence = lastResult[0].confidence;
          
          this.processCommand(transcript, confidence);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        this.reportError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateStatus();
      };
    }
  }

  private async loadCommands() {
    try {
      const response = await fetch(`${API_BASE_URL}/voice-commands`);
      const commands = await response.json();
      
      commands.forEach((cmd: any) => {
        this.commands.set(cmd.phrase, this.createCommandHandler(cmd));
      });
    } catch (error) {
      console.error('Failed to load voice commands:', error);
    }
  }

  private createCommandHandler(command: any) {
    return async (params: any) => {
      const response = await fetch(`${API_BASE_URL}/voice-commands/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: command.id,
          parameters: params,
          timestamp: Date.now()
        })
      });
      
      return response.json();
    };
  }

  private async processCommand(transcript: string, confidence: number) {
    const command: VoiceCommand = {
      id: crypto.randomUUID(),
      phrase: transcript,
      action: '',
      confidence,
      timestamp: Date.now()
    };

    // Find matching command
    const matchingCommand = this.findMatchingCommand(transcript);
    
    if (matchingCommand) {
      const result = await this.executeCommand(matchingCommand, transcript);
      command.action = result.action;
      
      // Send to backend for analysis
      await this.logCommand(command, result);
    }

    this.commandHistory.push(command);
  }

  private findMatchingCommand(transcript: string): string | null {
    for (const [phrase] of this.commands) {
      if (transcript.includes(phrase.toLowerCase())) {
        return phrase;
      }
    }
    return null;
  }

  private async executeCommand(command: string, transcript: string): Promise<VoiceCommandResult> {
    const handler = this.commands.get(command);
    
    if (handler) {
      try {
        const parameters = this.extractParameters(transcript, command);
        const result = await handler(parameters);
        
        return {
          command,
          confidence: 0.9,
          action: command,
          parameters,
          success: true
        };
      } catch (error) {
        return {
          command,
          confidence: 0.9,
          action: command,
          parameters: {},
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return {
      command,
      confidence: 0,
      action: 'unknown',
      parameters: {},
      success: false,
      error: 'Command not found'
    };
  }

  private extractParameters(transcript: string, command: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Extract parameters based on command type
    switch (command) {
      case 'open file':
        const fileMatch = transcript.match(/open file\s+(.+)/i);
        if (fileMatch) params.filename = fileMatch[1].trim();
        break;
      case 'run command':
        const cmdMatch = transcript.match(/run command\s+(.+)/i);
        if (cmdMatch) params.command = cmdMatch[1].trim();
        break;
      case 'search':
        const searchMatch = transcript.match(/search\s+(.+)/i);
        if (searchMatch) params.query = searchMatch[1].trim();
        break;
    }
    
    return params;
  }

  private async logCommand(command: VoiceCommand, result: VoiceCommandResult) {
    await fetch(`${API_BASE_URL}/voice-commands/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command,
        result,
        timestamp: Date.now()
      })
    });
  }

  private async reportError(error: string) {
    await fetch(`${API_BASE_URL}/voice-commands/error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error,
        timestamp: Date.now()
      })
    });
  }

  private updateStatus() {
    // Update status via API
    fetch(`${API_BASE_URL}/voice-commands/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isListening: this.isListening,
        timestamp: Date.now()
      })
    });
  }

  public startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
      this.updateStatus();
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.updateStatus();
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public getCommandHistory(): VoiceCommand[] {
    return [...this.commandHistory];
  }

  public async getStats() {
    const response = await fetch(`${API_BASE_URL}/voice-commands/stats`);
    return response.json();
  }
}

// React hook for voice commands
export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [error, setError] = useState<string | null>(null);

  const voiceService = new VoiceCommandService();

  useEffect(() => {
    setIsSupported(voiceService.isSupported());
  }, []);

  const startListening = useCallback(() => {
    if (voiceService.isSupported()) {
      voiceService.startListening();
      setIsListening(true);
      setError(null);
    } else {
      setError('Speech recognition not supported');
    }
  }, []);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
    setIsListening(false);
  }, []);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    lastCommand,
    error,
    getStats: () => voiceService.getStats()
  };
};
