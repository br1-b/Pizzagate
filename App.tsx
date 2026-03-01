import React, { useState, useEffect, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import StartMenu from './components/StartMenu';
import { AppId, WindowState } from './types';
import { BACKGROUNDS } from './constants';

const INITIAL_WINDOWS: WindowState[] = [
  { id: AppId.TRASH, title: 'TRASH', isOpen: false, isMinimized: false, zIndex: 10, position: { x: 100, y: 100 } },
  { id: AppId.JMAIL, title: 'JMAIL', isOpen: false, isMinimized: false, zIndex: 10, position: { x: 150, y: 50 } },
  { id: AppId.BGPICKER, title: 'BG PICKER', isOpen: false, isMinimized: false, zIndex: 10, position: { x: 200, y: 150 } },
  { id: AppId.NOTEPAD, title: 'NOTEPAD', isOpen: false, isMinimized: false, zIndex: 10, position: { x: 120, y: 80 } },
  { id: AppId.X, title: 'X', isOpen: false, isMinimized: false, zIndex: 10, position: { x: 250, y: 100 } },
  { id: AppId.DEXSCREENER, title: 'DEXSCREENER', isOpen: false, isMinimized: false, zIndex: 10, position: { x: 50, y: 50 } },
  { id: AppId.TELEGRAM, title: 'TELEGRAM', isOpen: false, isMinimized: false, zIndex: 10, position: { x: 300, y: 120 } },
  { id: AppId.MEMEMAKER, title: 'MEME MAKER', isOpen: false, isMinimized: false, zIndex: 10, position: { x: 200, y: 100 } },
];

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [background, setBackground] = useState(BACKGROUNDS[0].url);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [showNotepadHint, setShowNotepadHint] = useState(true);

  // Trigger boot sequence whenever isBooting becomes true
  useEffect(() => {
    console.log("App: Booting sequence started...");
    if (isBooting) {
      const timer = setTimeout(() => {
        console.log("App: Booting sequence finished, transitioning to desktop.");
        setIsBooting(false);
      }, 2000); // Reduced to 2s for better UX
      return () => clearTimeout(timer);
    }
  }, [isBooting]);

  const skipBoot = useCallback(() => {
    console.log("App: Boot skipped by user.");
    setIsBooting(false);
  }, []);

  const openWindow = useCallback((id: AppId) => {
    if (id === AppId.NOTEPAD) {
      setShowNotepadHint(false);
    }
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        const nextZ = maxZIndex + 1;
        setMaxZIndex(nextZ);
        
        // Smart Mobile Positioning: If opening for first time on mobile, center/top-left it
        let updatedPosition = w.position;
        if (!w.isOpen && window.innerWidth < 768) {
          updatedPosition = { x: 10, y: 10 };
        }
        
        return { 
          ...w, 
          isOpen: true, 
          isMinimized: false, 
          zIndex: nextZ,
          position: updatedPosition
        };
      }
      return w;
    }));
    setIsStartMenuOpen(false);
  }, [maxZIndex]);

  const restartApp = useCallback(() => {
    setIsBooting(true);
    setWindows(INITIAL_WINDOWS);
    setIsStartMenuOpen(false);
    setMaxZIndex(10);
    setShowNotepadHint(true);
  }, []);

  const closeWindow = (id: AppId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const focusWindow = (id: AppId) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w));
  };

  const toggleMinimize = (id: AppId) => {
    setWindows(prev => prev.map(w => {
        if (w.id === id) {
            if (w.isMinimized) {
                const nextZ = maxZIndex + 1;
                setMaxZIndex(nextZ);
                return { ...w, isMinimized: false, zIndex: nextZ };
            }
            return { ...w, isMinimized: true };
        }
        return w;
    }));
  };

  const moveWindow = (id: AppId, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position: { x, y } } : w));
  };

  if (isBooting) {
    return <LoadingScreen onSkip={skipBoot} />;
  }

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center select-none" 
      style={{ backgroundImage: `url("${background}")` }}
    >
      <Desktop onIconClick={openWindow} showNotepadHint={showNotepadHint} />

      {windows.map(win => (
        win.isOpen && (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            zIndex={win.zIndex}
            isMinimized={win.isMinimized}
            position={win.position}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMinimize={() => toggleMinimize(win.id)}
            onMove={(x, y) => moveWindow(win.id, x, y)}
            setBackground={setBackground}
          />
        )
      ))}

      {isStartMenuOpen && (
        <StartMenu 
          onAppClick={openWindow} 
          onClose={() => setIsStartMenuOpen(false)} 
          onRestart={restartApp}
        />
      )}

      <Taskbar 
        onStartClick={() => setIsStartMenuOpen(!isStartMenuOpen)} 
        activeWindows={windows.filter(w => w.isOpen)}
        onWindowClick={focusWindow}
        onWindowClose={closeWindow}
      />
    </div>
  );
};

export default App;