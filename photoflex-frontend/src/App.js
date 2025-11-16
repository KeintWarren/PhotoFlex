import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MessageBar from './components/MessageBar';

const API_URL = 'http://localhost:8080/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [message, setMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // API Utility Function
  const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody.message) {
            errorMessage = errorBody.message;
          } else if (typeof errorBody === 'string') {
            errorMessage = errorBody;
          }
        } catch (e) {
          // Use default message
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Fetch Error:', error);
      setMessage({ type: 'error', text: `Operation failed: ${error.message}` });
      throw error;
    }
  };

  const handleLogin = async (loginData) => {
    setMessage(null);
    try {
      const allUsers = await apiFetch('/users');
      const user = allUsers.find(u => u.email === loginData.email && u.password === loginData.password);

      if (user) {
        setCurrentUser(user);
        setView('home');
        setMessage({ type: 'success', text: `Welcome back, ${user.username}!` });
      } else {
        setMessage({ type: 'error', text: 'Invalid email or password.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Login failed. Check server status.' });
    }
  };

  const handleSignup = async (signupData) => {
    setMessage(null);
    try {
      const newUser = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({
          ...signupData,
          createdDate: new Date().toISOString()
        }),
      });
      setCurrentUser(newUser);
      setView('home');
      setMessage({ type: 'success', text: `Account created! Welcome, ${newUser.username}!` });
    } catch (e) {
      setMessage({ type: 'error', text: 'Signup failed. User may already exist.' });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setMessage({ type: 'info', text: 'You have been logged out.' });
  };

  if (!currentUser) {
    return (
      <div className="font-sans antialiased">
        <MessageBar message={message} setMessage={setMessage} />
        {view === 'login' ? (
          <Login onLogin={handleLogin} onSwitch={() => setView('signup')} />
        ) : (
          <Signup onSignup={handleSignup} onSwitch={() => setView('login')} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased flex">
      <MessageBar message={message} setMessage={setMessage} />

      {/* Sidebar */}
      <Sidebar
        view={view}
        setView={setView}
        currentUser={currentUser}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 md:p-8">
          {view === 'home' && (
            <Homepage
              currentUser={currentUser}
              apiFetch={apiFetch}
              setMessage={setMessage}
            />
          )}
          {view === 'profile' && (
            <Profile
              currentUser={currentUser}
              apiFetch={apiFetch}
              setMessage={setMessage}
            />
          )}
          {view === 'settings' && (
            <Settings
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              apiFetch={apiFetch}
              setMessage={setMessage}
            />
          )}
        </main>
      </div>
    </div>
  );
}