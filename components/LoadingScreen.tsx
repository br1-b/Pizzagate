import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onSkip?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onSkip }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const messages = [
    "ENCRYPTING CONNECTION...",
    "NOT A THEORY IF REAL...",
    "THE TRUTH WILL COME OUT...",
    "PIZZAGATE IS REAL"
  ];

  useEffect(() => {
    // Show skip button after 1 second if still loading
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 200);

    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 800);

    return () => {
      clearTimeout(skipTimer);
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Logo */}
      <div className="mb-12 relative">
        <div className="w-32 h-32 md:w-48 md:h-48 bg-yellow-500/20 rounded-full blur-3xl absolute -inset-8 animate-pulse"></div>
        <img 
          src="https://i.postimg.cc/DzjzfdF3/Untitled-design-(2).png" 
          alt="PIZZAGATE Logo" 
          className="w-32 h-32 md:w-48 md:h-48 relative z-10 drop-shadow-[0_0_25px_rgba(234,179,8,0.6)] object-contain"
        />
      </div>

      <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-2 animate-pulse uppercase">
        PIZZAGATE OS
      </h1>
      <p className="text-sm font-mono tracking-[0.3em] text-yellow-500 mb-24 opacity-80 uppercase">
        V 4.2 SECURE BOOT
      </p>

      {/* Progress Bar Container */}
      <div className="w-64 md:w-96 flex flex-col items-center">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-yellow-500 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(234,179,8,0.8)]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center font-mono text-[10px] tracking-widest uppercase w-full mb-8">
          <span className="text-white/60 min-w-0 truncate pr-4">{messages[messageIndex]}</span>
          <span className="text-yellow-500 font-bold shrink-0">{Math.min(progress, 100)}%</span>
        </div>

        {showSkip && onSkip && (
          <button 
            onClick={onSkip}
            className="text-[10px] font-mono text-white/30 hover:text-[#FACC15] uppercase tracking-[0.3em] border border-white/10 hover:border-[#FACC15]/30 px-4 py-2 rounded-sm transition-all animate-in fade-in duration-500"
          >
            [ SKIP BOOT SEQUENCE ]
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;