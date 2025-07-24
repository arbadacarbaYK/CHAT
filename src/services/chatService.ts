import axios from 'axios';
import { config } from '../config/appConfig';

export interface ChatMessage {
  sender: 'user' | 'avatar';
  text: string;
  timestamp: number;
}

export interface ChatResponse {
  response: string;
  success: boolean;
  error?: string;
}

export interface OllamaHealth {
  isRunning: boolean;
  modelAvailable: boolean;
  modelName: string;
  error?: string;
}

export class ChatService {
  private static instance: ChatService;
  private conversationHistory: ChatMessage[] = [];
  private healthStatus: OllamaHealth = {
    isRunning: false,
    modelAvailable: false,
    modelName: config.ollama.model
  };

  private constructor() {
    this.checkHealth();
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public async checkHealth(): Promise<OllamaHealth> {
    try {
      // Check if Ollama is running
      const healthResponse = await axios.get(`${config.ollama.url}/tags`, {
        timeout: 5000
      });

      this.healthStatus.isRunning = true;

      // Check if our model is available
      const models = healthResponse.data.models || [];
      const ourModel = models.find((m: any) => m.name === config.ollama.model);
      
      this.healthStatus.modelAvailable = !!ourModel;
      this.healthStatus.modelName = config.ollama.model;

      return this.healthStatus;
    } catch (error: any) {
      console.error('Ollama health check failed:', error);
      
      this.healthStatus.isRunning = false;
      this.healthStatus.modelAvailable = false;
      this.healthStatus.error = error.message;

      return this.healthStatus;
    }
  }

  public getHealthStatus(): OllamaHealth {
    return { ...this.healthStatus };
  }

  public async sendMessage(
    message: string,
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<ChatResponse> {
    try {
      // Check health before sending message
      const health = await this.checkHealth();
      if (!health.isRunning) {
        return {
          response: "I'm sorry, but I can't connect to my local AI service. Please make sure Ollama is installed and running. You can install it from https://ollama.ai and run 'ollama serve' to start the service.",
          success: false,
          error: 'Ollama not running'
        };
      }

      if (!health.modelAvailable) {
        return {
          response: `I'm sorry, but the AI model (${config.ollama.model}) is not available. Please run 'ollama pull ${config.ollama.model}' to download it.`,
          success: false,
          error: 'Model not available'
        };
      }

      // Add user message to history
      const userMessage: ChatMessage = { 
        sender: 'user', 
        text: message,
        timestamp: Date.now()
      };
      this.conversationHistory.push(userMessage);

      // Limit history length
      if (this.conversationHistory.length > config.chat.maxHistoryLength) {
        this.conversationHistory = this.conversationHistory.slice(-config.chat.maxHistoryLength);
      }

      // Create system prompt based on skill level
      const systemPrompt = this.createSystemPrompt(skillLevel);

      // Prepare conversation context (last 10 messages)
      const recentMessages = this.conversationHistory.slice(-10);
      const conversationContext = recentMessages
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Kei'}: ${msg.text}`)
        .join('\n');

      // Create the full prompt for Ollama
      const fullPrompt = `${systemPrompt}

Current conversation:
${conversationContext}

Kei:`;

      const response = await axios.post(
        `${config.ollama.url}/generate`,
        {
          model: config.ollama.model,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: config.ollama.timeout
        }
      );

      const responseText = response.data.response;
      
      // Add the avatar response to history
      const avatarMessage: ChatMessage = {
        sender: 'avatar',
        text: responseText,
        timestamp: Date.now()
      };
      this.conversationHistory.push(avatarMessage);

      return {
        response: responseText,
        success: true
      };
    } catch (error: any) {
      console.error('Ollama API Error:', error);
      
      // Check if Ollama is not running
      if (error.code === 'ECONNREFUSED' || error.message?.includes('connect')) {
        return {
          response: "I'm sorry, but I can't connect to my local AI service. Please make sure Ollama is installed and running. You can install it from https://ollama.ai and run 'ollama serve' to start the service.",
          success: false,
          error: 'Connection refused'
        };
      }
      
      // Check for timeout
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          response: "I'm sorry, the AI model is taking longer than expected to respond. This usually happens on the first request as the model loads into memory. Please try again in a moment.",
          success: false,
          error: 'Timeout'
        };
      }
      
      return {
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        success: false,
        error: error.message
      };
    }
  }

  private createSystemPrompt(skillLevel: 'beginner' | 'intermediate' | 'advanced'): string {
    const basePrompt = `You are Kei, a friendly and knowledgeable Bitcoin education guide. You have expertise in Bitcoin, Lightning Network, and Nostr. You should be encouraging, patient, and always educational. Keep responses conversational and engaging. Always stay in character as Kei.`;

    const skillPrompts = {
      beginner: `${basePrompt} The user is a beginner. Use simple language, avoid technical jargon, and provide clear explanations. Focus on fundamental concepts like what Bitcoin is, why it matters, and basic security practices. Use analogies and real-world examples. Keep responses under 200 words.`,
      intermediate: `${basePrompt} The user has some knowledge. You can use more technical terms but still explain them. Cover topics like Lightning Network, wallet types, transaction fees, and intermediate security concepts. Provide practical examples. Keep responses under 300 words.`,
      advanced: `${basePrompt} The user is advanced. You can dive deep into technical details, discuss advanced topics like Nostr, Lightning routing, privacy features, and complex Bitcoin concepts. Engage in technical discussions. Keep responses under 400 words.`
    };

    return skillPrompts[skillLevel];
  }

  public clearHistory(): void {
    this.conversationHistory = [];
  }

  public getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  public getHistoryLength(): number {
    return this.conversationHistory.length;
  }
} 