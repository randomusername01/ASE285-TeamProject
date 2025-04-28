import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Login from './Login';
import './styles.css';

function LoginFirst() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      {user ? <App /> : <Login setUser={setUser} />}
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoginFirst />
  </React.StrictMode>
);
