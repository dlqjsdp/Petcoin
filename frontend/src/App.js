import React, { useState } from 'react';
import UserApp from './user/UserApp';
import AdminApp from './admin/AdminApp';
import KioskApp from './kiosk/KioskApp';

function App() {
  const [mode, setMode] = useState('admin'); // 'user' | 'admin' | 'kiosk'

  return (
    <div>
      {mode === 'user' && <UserApp />}
      {mode === 'admin' && <AdminApp />}
      {mode === 'kiosk' && <KioskApp />}
    </div>
  );
}

export default App;
