import React from 'react';

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white font-mono">
      <div className="text-center">
        <img src="https://i.postimg.cc/DzjzfdF3/Untitled-design-(2).png" alt="PIZZAGATE" className="w-32 h-32 mx-auto mb-8 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4 text-[#FACC15]">PIZZAGATE OS</h1>
        <p className="text-xl text-white/60">System rebooting...</p>
      </div>
    </div>
  );
};

export default App;
