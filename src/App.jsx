import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Timer from './Timer'
import EnhancedTimer from './EnhancedTimer'
import AlertTimerApp from './AlertTimerApp'

function App() {
  return (
    <div className="bg-gray-100">
      <AlertTimerApp />
    </div>
  );
}

export default App;

// This template is followed this guide https://tailwindcss.com/docs/guides/vite to install tailwindcss into statckblitz react project
