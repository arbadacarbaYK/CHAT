import { useState, useEffect } from 'react';
import { AvatarDisplay } from './components/AvatarDisplay';
import { ChatUI } from './components/ChatUI';
import { ChatService } from './services/chatService';
import { config } from './config/appConfig';
import './App.css';

type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

function App() {
  const avatars = [
    {
      name: 'Satoshi',
      label: 'Bitcoin Guide',
      glbUrl: 'https://models.readyplayer.me/6880d2d61f1087112a37ef6a.glb',
    },
    // Add more avatars here as you generate them
  ];
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState(0);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('beginner');
  const [isStarted, setIsStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [reactTrigger, setReactTrigger] = useState(0);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < config.ui.mobileBreakpoint);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleBackToMenu = () => {
    setIsStarted(false);
    // Clear chat history when going back to menu
    const chatService = ChatService.getInstance();
    chatService.clearHistory();
  };

  const getSkillLevelDescription = (level: SkillLevel) => {
    switch (level) {
      case 'beginner':
        return 'New to Bitcoin? Start here with the basics!';
      case 'intermediate':
        return 'Know some Bitcoin? Let\'s dive deeper!';
      case 'advanced':
        return 'Bitcoin expert? Let\'s explore advanced topics!';
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            Bitcoin Education Roleplay
          </h1>
          <p className="text-white/80 mb-8 text-lg">
            Learn about Bitcoin, Lightning Network, and Nostr through interactive conversations with our AI avatar.
          </p>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Choose Your Avatar</h2>
              <div className="flex justify-center h-full max-h-[80vh] items-center">
                {avatars.map((avatar, idx) => (
                  <button
                    key={avatar.name}
                    onClick={() => setSelectedAvatarIdx(idx)}
                    className={`p-4 rounded-lg border-2 transition-all ${selectedAvatarIdx === idx ? 'bg-orange-400/20' : 'border-white/30 bg-white/10 hover:bg-white/20'}`}
                  >
                    <div className="w-64 h-80 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                      <AvatarDisplay glbUrl={avatar.glbUrl} cameraOrbit="0deg 90deg 5.5m" fieldOfView="12deg" headOnly={false} />
                    </div>
                    <p className="text-white mt-2">{avatar.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Select Your Skill Level</h2>
              <div className="space-y-3">
                {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSkillLevel(level)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${skillLevel === level ? 'border-orange-400 bg-orange-400/20' : 'border-white/30 bg-white/10 hover:bg-white/20'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-semibold capitalize">{level}</div>
                        <div className="text-white/60 text-sm">{getSkillLevelDescription(level)}</div>
                      </div>
                      {skillLevel === level && (
                        <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 w-full"
            >
              Start Learning
            </button>

            <div className="text-white/60 text-sm">
              <p>💡 This app uses local AI (Ollama) - completely free and private!</p>
              <p>🔒 Your conversations never leave your device</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col">
        {/* Fixed Header */}
        <div className="bg-white/10 backdrop-blur-lg p-4 flex-shrink-0 sticky top-0 z-20">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBackToMenu}
              className="text-white hover:text-orange-400 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-lg font-semibold text-white">Bitcoin Education</h1>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-white hover:text-orange-400 transition-colors"
            >
              ⚙️
            </button>
          </div>
          {showSettings && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="text-white text-sm">
                <div className="mb-2">Skill Level: <span className="text-orange-400 capitalize">{skillLevel}</span></div>
                <div className="text-white/60 text-xs">
                  {getSkillLevelDescription(skillLevel)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Avatar Section */}
        <div className="flex-1 flex items-center justify-center h-full max-h-[80vh] p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 w-full max-w-sm">
            <AvatarDisplay glbUrl={avatars[selectedAvatarIdx].glbUrl} cameraOrbit="0deg 90deg 5.5m" fieldOfView="12deg" headOnly={false} reactTrigger={reactTrigger} mainPage={true} />
            <div className="text-center mt-4">
              <h2 className="text-xl font-bold text-white mb-2">{avatars[selectedAvatarIdx].name}</h2>
              <p className="text-white/80 text-sm">Your Bitcoin Education Guide</p>
              <div className="mt-2">
                <span className="inline-block bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm capitalize">
                  {skillLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white/10 backdrop-blur-lg p-4 flex-shrink-0">
          <ChatUI skillLevel={skillLevel} onReact={() => setReactTrigger((prev) => prev + 1)} />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex">
      {/* Header */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleBackToMenu}
          className="bg-white/10 backdrop-blur-lg text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Menu
        </button>
      </div>

      {/* Avatar Section */}
      <div className="w-1/2 h-screen flex flex-col p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center h-full max-h-[80vh]">
            <AvatarDisplay glbUrl={avatars[selectedAvatarIdx].glbUrl} cameraOrbit="0deg 90deg 5.5m" fieldOfView="12deg" headOnly={false} reactTrigger={reactTrigger} mainPage={true} />
          </div>
          <div className="text-center mt-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white mb-2">{avatars[selectedAvatarIdx].name}</h2>
            <p className="text-white/80">Your Bitcoin Education Guide</p>
            <div className="mt-2">
              <span className="inline-block bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm capitalize">
                {skillLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-1/2 h-screen flex flex-col p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full h-full flex flex-col">
          <ChatUI skillLevel={skillLevel} onReact={() => setReactTrigger((prev) => prev + 1)} />
        </div>
      </div>
    </div>
  );
}

export default App;
