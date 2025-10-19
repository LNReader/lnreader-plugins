import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import Home from './pages/home';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" />
      <Home />
    </div>
  );
}

export default App;
