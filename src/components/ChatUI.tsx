import { useState, useEffect, useRef } from 'react';
import { ChatService } from '../services/chatService';
import { config } from '../config/appConfig';

interface Message {
  sender: 'user' | 'avatar';
  text: string;
  timestamp: number;
}

interface OllamaHealth {
  isRunning: boolean;
  modelAvailable: boolean;
  modelName: string;
  error?: string;
}

interface ChatUIProps {
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  onReact?: () => void;
}

export const ChatUI: React.FC<ChatUIProps> = ({ skillLevel, onReact }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'avatar', 
      text: `Hello! I'm Kei, your Bitcoin education guide. I'll be teaching you at the ${skillLevel} level. Ask me anything about Bitcoin, Lightning Network, or Nostr!`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState<OllamaHealth>({
    isRunning: false,
    modelAvailable: false,
    modelName: config.ollama.model
  });
  const [showHealthStatus, setShowHealthStatus] = useState(false);
  // Add state for audio features
  const [isListening, setIsListening] = useState(false);
  const [reactTrigger, setReactTrigger] = useState(0);
  const recognitionRef = useRef<any>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);

  const chatService = ChatService.getInstance();

  useEffect(() => {
    // Check health status on component mount
    checkHealth();
    
    // Check health every configured interval
    const healthInterval = setInterval(checkHealth, config.chat.healthCheckInterval);
    
    // Check microphone permission
    checkMicPermission();
    
    return () => clearInterval(healthInterval);
  }, []);

  const checkHealth = async () => {
    const health = await chatService.checkHealth();
    setHealthStatus(health);
  };

  const checkMicPermission = async () => {
    try {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setMicPermission(true);
      } else {
        setMicPermission(false);
      }
    } catch (error) {
      setMicPermission(false);
      console.log('Microphone permission denied or not available');
    }
  };

  // Speech-to-text logic
  const startListening = async () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setMicPermission(true);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please allow microphone access and try again.');
        } else if (event.error === 'network') {
          alert('Network error occurred during speech recognition. Please check your internet connection.');
        } else if (event.error === 'no-speech') {
          alert('No speech detected. Please try speaking again.');
        } else if (event.error === 'audio-capture') {
          alert('Audio capture error. Please check your microphone settings.');
        } else {
          alert('Speech recognition error occurred. Please try again.');
        }
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
      
      recognitionRef.current.start();
    } catch (error) {
      console.error('Microphone permission error:', error);
      setMicPermission(false);
      alert('Microphone permission denied or not available. Please check your browser settings.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // TTS logic
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (!text.trim()) {
      alert('No text to speak.');
      return;
    }

    // Stop any current speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';
    
    // Try to use a female voice if available
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      (voice.name.includes('female') || voice.name.includes('Samantha') || voice.name.includes('Victoria'))
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => {
      console.log('TTS started');
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      console.log('TTS ended');
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('TTS error:', event);
      setIsSpeaking(false);
      
      if (event.error === 'not-allowed') {
        alert('Text-to-speech is not allowed. Please check your browser settings.');
      } else if (event.error === 'network') {
        alert('Network error occurred during text-to-speech.');
      } else if (event.error === 'synthesis-failed') {
        alert('Text-to-speech synthesis failed. Please try again.');
      } else if (event.error === 'audio-busy') {
        alert('Audio system is busy. Please try again.');
      } else if (event.error === 'audio-hardware') {
        alert('Audio hardware error. Please check your speakers.');
      } else {
        alert('Text-to-speech error occurred. Please try again.');
      }
    };
    
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS speak error:', error);
      setIsSpeaking(false);
      alert('Failed to start text-to-speech. Please try again.');
    }
  };

  // Modify handleSend to trigger avatar reactivity and TTS
  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Validate message length
    if (text.length > config.ui.maxMessageLength) {
      alert(`Message too long. Maximum ${config.ui.maxMessageLength} characters allowed.`);
      return;
    }

    // Add user message
    const userMessage: Message = { 
      sender: 'user', 
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    if (onReact) onReact(); // React to user input

    try {
      // Get AI response from chat service
      const response = await chatService.sendMessage(text, skillLevel);
      
      const avatarResponse: Message = {
        sender: 'avatar',
        text: response.response,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, avatarResponse]);
      if (onReact) onReact(); // React to AI output
      speak(response.response); // TTS for avatar output
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        sender: 'avatar',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  const clearChat = () => {
    setMessages([{
      sender: 'avatar',
      text: `Hello! I'm Kei, your Bitcoin education guide. I'll be teaching you at the ${skillLevel} level. Ask me anything about Bitcoin, Lightning Network, or Nostr!`,
      timestamp: Date.now()
    }]);
    chatService.clearHistory();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getHealthStatusColor = () => {
    if (healthStatus.isRunning && healthStatus.modelAvailable) {
      return 'text-green-400';
    } else if (healthStatus.isRunning) {
      return 'text-yellow-400';
    } else {
      return 'text-red-400';
    }
  };

  const getHealthStatusText = () => {
    if (healthStatus.isRunning && healthStatus.modelAvailable) {
      return 'AI Ready';
    } else if (healthStatus.isRunning) {
      return 'Model Missing';
    } else {
      return 'AI Offline';
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header with health status */}
      <div className="flex justify-between items-center mb-4 w-full px-4 flex-shrink-0">
        <h3 className="text-lg font-semibold text-white">Chat with Kei</h3>
        <div className="flex items-center space-x-2">
          <div 
            className={`flex items-center space-x-1 cursor-pointer ${getHealthStatusColor()}`}
            onClick={() => setShowHealthStatus(!showHealthStatus)}
            title="Click to see AI status"
          >
            <div className={`w-2 h-2 rounded-full ${
              healthStatus.isRunning && healthStatus.modelAvailable ? 'bg-green-400' :
              healthStatus.isRunning ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            <span className="text-sm">{getHealthStatusText()}</span>
          </div>
          <button
            onClick={clearChat}
            className="text-white bg-orange-500 hover:bg-white/80 hover:text-orange-500 text-sm px-2 py-1 rounded transition-colors"
            title="Clear chat history"
          >
            &#10005;
          </button>
        </div>
      </div>

      {/* Health status details */}
      {showHealthStatus && (
        <div className="mb-4 p-3 bg-white/10 rounded-lg text-sm w-full px-4 flex-shrink-0">
          <div className="text-white/80 mb-2">AI Service Status:</div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Ollama Service:</span>
              <span className={healthStatus.isRunning ? 'text-green-400' : 'text-red-400'}>
                {healthStatus.isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Model ({healthStatus.modelName}):</span>
              <span className={healthStatus.modelAvailable ? 'text-green-400' : 'text-red-400'}>
                {healthStatus.modelAvailable ? 'Available' : 'Missing'}
              </span>
            </div>
            {healthStatus.error && (
              <div className="text-red-400 text-xs mt-1">
                Error: {healthStatus.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages area - takes up remaining space */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 px-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}
          >
            <div className="max-w-md">
              <div
                className={`px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                {message.text}
              </div>
              <div className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-right text-white/60' : 'text-left text-white/60'
              }`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="bg-white/20 text-white px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input form - fixed at bottom within chat area */}
      <div className="flex-shrink-0 p-4 border-t border-white/20 bg-white/5 rounded-b-2xl sticky bottom-0 z-10">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full flex-nowrap">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about Bitcoin, Lightning, or Nostr..."
            className="flex-1 min-w-0 h-12 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-orange-400"
            disabled={isLoading || !healthStatus.isRunning || !healthStatus.modelAvailable}
            maxLength={config.ui.maxMessageLength}
          />
          <button
            type="button"
            onClick={startListening}
            disabled={isLoading || !healthStatus.isRunning || !healthStatus.modelAvailable || isListening}
            title="Speak to type"
            className="h-12 w-12 flex-shrink-0 rounded-lg transition-colors bg-orange-500 text-white hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isListening ? '🎤...' : '🎤'}
          </button>
          <button
            type="button"
            onClick={() => speak(messages[messages.length - 1]?.text || '')}
            disabled={isLoading || !healthStatus.isRunning || !healthStatus.modelAvailable || messages.length === 0}
            title="Read last message aloud"
            className="h-12 w-12 flex-shrink-0 rounded-lg transition-colors bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            🔊
          </button>
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading || !healthStatus.isRunning || !healthStatus.modelAvailable}
            className="h-12 w-16 flex-shrink-0 rounded-lg transition-colors bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Send
          </button>
        </form>
      </div>

      {/* Help text for offline status */}
      {(!healthStatus.isRunning || !healthStatus.modelAvailable) && (
        <div className="mt-2 text-xs text-white/60 text-center w-full px-4 flex-shrink-0">
          {!healthStatus.isRunning ? (
            <div>
              AI service is offline. Please start Ollama: <code className="bg-white/20 px-1 rounded">ollama serve</code>
            </div>
          ) : (
            <div>
              Model not found. Please download: <code className="bg-white/20 px-1 rounded">ollama pull {healthStatus.modelName}</code>
            </div>
          )}
        </div>
      )}
      {audioError && (
        <div className="mt-2 text-xs text-red-400 text-center w-full px-4 flex-shrink-0">
          {audioError}
          <button 
            onClick={() => setAudioError(null)} 
            className="ml-2 text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}; 