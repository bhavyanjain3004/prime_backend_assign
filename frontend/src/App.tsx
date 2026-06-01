import React, { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  const [currentRoute, setCurrentRoute] = useState<'login' | 'register' | 'dashboard'>('register');

  return (
    <>
      {currentRoute === 'register' && <Register onNavigate={setCurrentRoute} />}
      {currentRoute === 'login' && <Login onNavigate={setCurrentRoute} />}
      {currentRoute === 'dashboard' && <div>Dashboard (TODO)</div>}
    </>
  );
}

export default App;
