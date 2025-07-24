# Developer Setup Instructions

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge with WebGL support
- **Ollama**: For local AI chat functionality (completely free!)

## Initial Setup

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd bitcoin-edu-roleplay

# Install dependencies
npm install
```

### 2. Ollama Configuration

1. **Install Ollama**
   - Visit [Ollama.ai](https://ollama.ai)
   - Download and install for your operating system
   - Follow the installation instructions for your platform

2. **Pull the AI Model**
   ```bash
   # Pull the lightweight Llama 3.2 3B model (free and fast)
   ollama pull llama3.2:3b
   ```

3. **Start Ollama Service**
   ```bash
   # Start the Ollama service
   ollama serve
   ```

4. **Verify Installation**
   - Visit http://localhost:11434 in your browser
   - You should see Ollama's API interface
   - Or run: `ollama list` to see available models

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

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

## Project Structure

```
bitcoin-edu-roleplay/
├── public/
│   ├── avatars/           # Avatar assets (GLB URLs)
│   └── ...
├── src/
│   ├── components/        # React components
│   │   ├── AvatarDisplay.tsx        # 3D avatar rendering with <model-viewer>
│   │   ├── ChatUI.tsx               # Chat interface
│   │   └── AvatarSelector.tsx       # Avatar/skill selection
│   ├── services/         # API services
│   │   └── chatService.ts  # Ollama integration
│   ├── App.tsx           # Main application
│   └── main.tsx          # Application entry point
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```

## Development Workflow

### 1. Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### 2. Hot Module Replacement
The development server supports HMR, so changes to components will be reflected immediately.

## Troubleshooting

### Ollama Not Working
1. **Check Installation**: Ensure Ollama is properly installed
2. **Verify Service**: Run `ollama serve` and check http://localhost:11434
3. **Model Download**: Run `ollama pull llama3.2:3b` to download the model
4. **Check Models**: Run `ollama list` to see available models
5. **Restart Service**: Stop and restart `ollama serve`

### Avatar Not Displaying
1. **Check Browser Console**: Look for WebGL or <model-viewer> errors
2. **Verify GLB URL**: Ensure the avatar GLB URL is correct and accessible
3. **WebGL Support**: Ensure browser supports WebGL

### Chat Not Working
1. **Ollama Service**: Ensure Ollama is running on http://localhost:11434
2. **Model Availability**: Check if the model is downloaded with `ollama list`
3. **Network Connectivity**: Verify the app can connect to local Ollama service
4. **Browser Console**: Check for network errors in browser dev tools

### Build Issues
1. **Dependencies**: Clear `node_modules` and run `npm install`
2. **Node Version**: Ensure Node.js 18+ is installed
3. **Environment**: Verify all required environment variables are set

## Production Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Ollama Setup for Production
Ensure the production server has:
- Ollama installed and running
- Required model downloaded
- Proper network access to Ollama service

### 3. Deploy
The `dist/` folder contains the production build ready for deployment.

## Security Considerations

1. **Local AI**: Ollama runs locally, so no data leaves your machine
2. **No API Keys**: No external API keys required
3. **Privacy**: All conversations stay on your local machine
4. **Network Access**: Only local network access to Ollama service

## Performance Optimization

1. **Avatar Loading**: GLB models are loaded asynchronously
2. **Chat History**: Limited to last 10 messages to prevent token bloat
3. **Bundle Size**: Tree-shaking removes unused code
4. **AI Model**: Using lightweight llama3.2:3b for fast responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section
- Review browser console for error messages
- Ensure all prerequisites are met
- Check Ollama documentation at https://ollama.ai
