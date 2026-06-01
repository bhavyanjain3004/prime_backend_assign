import React, { useState } from 'react';
import Register from './pages/Register';

function App() {
  const [currentRoute, setCurrentRoute] = useState<'login' | 'register' | 'dashboard'>('register');

  return (
    <>
      {currentRoute === 'register' && <Register onNavigate={setCurrentRoute} />}
      {currentRoute === 'login' && <div>Login Page (TODO)</div>}
      {currentRoute === 'dashboard' && <div>Dashboard (TODO)</div>}
    </>
  );
}

export default App;
