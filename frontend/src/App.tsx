import React, { useState, useEffect } from 'react';
import LeadManagement from './components/LeadManagement';
import './App.css';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token && data.user) {
        setIsLoggedIn(true);
        setUser(data.user);
        setMessage(`✅ Login successful! Welcome ${data.user.name}`);
        
        // Store token and user in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Connection error. Make sure backend is running on port 5000.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setEmail('');
    setPassword('');
    setMessage('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // If user is logged in, show Lead Management
  if (isLoggedIn && user) {
    return <LeadManagement user={user} onLogout={handleLogout} />;
  }

  // Login form
  // In the login form section of App.tsx:
  <form onSubmit={handleLogin}>
    <div className="login-form-group">
      <label className="login-label">Email</label>
      <input
        type="email"
        className="login-input"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
        aria-label="Email address"
      />
    </div>

    <div className="login-form-group">
      <label className="login-label">Password</label>
      <input
        type="password"
        className="login-input"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
        aria-label="Password"
      />
    </div>

    <button 
      type="submit" 
      className="login-button"
      disabled={isLoading}
    >
      {isLoading ? 'Signing in...' : 'Sign In'}
    </button>
  </form>
  return (
    <div className="app-container">
      <div className="login-card">
        <h1 className="login-title">CRM System</h1>
        <p className="login-subtitle">Sign in to your account</p>
        
        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <label className="login-label">Email</label>
            <input
              type="email"
              className="login-input"
              placeholder="user@crm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="login-form-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {message && (
          <div className={`message ${message.includes('✅') ? 'message-success' : 'message-error'}`}>
            {message}
          </div>
        )}
        
        <div className="status-box">
          <p className="status-text">
            <strong>Backend Status:</strong> Running on port 5000 ✅<br />
            <strong>Frontend Status:</strong> Connected to backend ✅
          </p>
        </div>

        <div className="credentials">
          <p><strong>Test Credentials:</strong></p>
          <p>Email: test1763121995797@crm.com</p>
          <p>Password: test123</p>
        </div>
      </div>
    </div>
  );
}

export default App;