# Bitcoin Education Roleplay

An interactive web-based education platform featuring a 3D avatar (GLB model) that teaches users about Bitcoin, Lightning Network, and Nostr through engaging conversations.

## Features

- **3D Avatar Rendering**: Uses `<model-viewer>` to display GLB avatars (e.g., Ready Player Me)
- **AI-Powered Chat**: Intelligent responses tailored to user skill levels using local Ollama models
- **Skill Level Adaptation**: Content adjusts based on beginner, intermediate, or advanced knowledge
- **Modern UI**: Beautiful, responsive design with glassmorphism effects
- **Voice Input & Output**: Use your microphone to ask questions and have responses read aloud (browser-based)
- **Educational Focus**: Comprehensive coverage of Bitcoin ecosystem topics (no real wallet/Nostr integration)
- **Completely Free**: Uses local Ollama AI models - no API costs, no external keys
- **Production Ready**: Health checks, error handling, configuration system
- **Mobile Responsive**: Works perfectly on desktop and mobile devices
- **Privacy First**: All conversations stay on your local machine

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Avatar Technology**: `<model-viewer>` with GLB models (Ready Player Me or similar)
- **AI Integration**: Ollama with local models (completely free!)
- **Build Tools**: npm/npx, Vite, PostCSS, Autoprefixer

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Ollama (install from https://ollama.ai)

### Installation
```bash
# Clone and install
git clone <repository-url>
cd bitcoin-edu-roleplay
npm install

# Install and setup Ollama
# 1. Install Ollama from https://ollama.ai
# 2. Pull the model: ollama pull llama3.2:3b
# 3. Start Ollama service: ollama serve

# Start development server
npm run dev
```

### Ollama Setup
1. **Install Ollama**: Download from https://ollama.ai
2. **Pull the Model**: `ollama pull llama3.2:3b`
3. **Start Service**: `ollama serve`
4. **Verify**: Visit http://localhost:11434 to check if Ollama is running

## Configuration

The app supports environment-based configuration. Copy `env.example` to `.env` and customize:

```bash
# Ollama Configuration
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama3.2:3b
VITE_OLLAMA_TIMEOUT=60000

# Chat Configuration
VITE_CHAT_MAX_HISTORY=20
VITE_HEALTH_CHECK_INTERVAL=30000

# UI Configuration
VITE_MOBILE_BREAKPOINT=768
VITE_MAX_MESSAGE_LENGTH=1000
```

## Usage

1. **Select Skill Level**: Choose beginner, intermediate, or advanced
2. **Start Learning**: Click "Start Learning" to begin
3. **Chat with the Avatar**: Ask questions about Bitcoin, Lightning Network, or Nostr
4. **Use Voice Features**: Speak your questions or have answers read aloud
5. **Monitor AI Status**: Check the health indicator to ensure AI is ready

## Production Deployment

### Build for Production
```bash
npm run build
```

The `dist/` folder contains the production build ready for deployment.

### Production Requirements
- Web server (nginx, Apache, etc.)
- Ollama running on the server or accessible network
- Required model downloaded: `ollama pull llama3.2:3b`

## Project Structure

```
src/
├── components/          # React components
│   ├── AvatarDisplay.tsx        # 3D avatar rendering with <model-viewer>
│   ├── ChatUI.tsx               # Chat interface with health monitoring
│   └── AvatarSelector.tsx       # Avatar/skill selection
├── services/           # API services
│   └── chatService.ts  # Ollama integration with health checks
├── config/             # Configuration management
│   └── appConfig.ts    # Environment-based configuration
├── App.tsx             # Main application with responsive design
└── main.tsx            # Application entry point

public/
├── avatars/            # Avatar assets (GLB URLs)
└── ...
```

## Troubleshooting

### Ollama Not Working
- Make sure Ollama is installed: https://ollama.ai
- Check if service is running: `ollama serve`
- Verify model is downloaded: `ollama list`
- Pull the model: `ollama pull llama3.2:3b`
- Check the health indicator in the chat interface

### Avatar Not Displaying
- Check browser console for WebGL errors
- Ensure GLB model URLs are correct and accessible

### Chat Not Working
- Ensure Ollama is running on http://localhost:11434
- Check if the model is downloaded and available
- Verify network connectivity to local Ollama service
- Look at the health status indicator for detailed error information

### Performance Issues
- Use a smaller model: `ollama pull llama3.2:3b` (instead of larger models)
- Adjust timeout settings in configuration
- Check system resources (CPU, RAM)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section
- Review browser console for error messages
- Ensure all prerequisites are met
- Check Ollama documentation at https://ollama.ai
- Verify configuration settings in your `.env` file
