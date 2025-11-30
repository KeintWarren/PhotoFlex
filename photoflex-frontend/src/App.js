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
  // Initialize currentUser from sessionStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState(() => {
    return sessionStorage.getItem('currentView') || 'login';
  });

  const [message, setMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Save user and view to sessionStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
      sessionStorage.setItem('currentView', view);
    } else {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentView');
    }
  }, [currentUser, view]);

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
          const errorBody = await response.text();
          console.error('Error response body:', errorBody);

          try {
            const errorJson = JSON.parse(errorBody);
            if (errorJson.message) {
              errorMessage = errorJson.message;
            } else if (errorJson.error) {
              errorMessage = errorJson.error;
            }
          } catch (e) {
            if (errorBody.includes('<!DOCTYPE') || errorBody.includes('<html')) {
              errorMessage = `Server Error: ${response.status} - Check backend logs`;
            } else if (errorBody.length > 0 && errorBody.length < 200) {
              errorMessage = errorBody;
            }
          }
        } catch (e) {
          console.error('Error parsing response:', e);
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Fetch Error:', error);
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
      setMessage({ type: 'error', text: `Login failed: ${e.message}` });
    }
  };

  const handleSignup = async (signupData) => {
    setMessage(null);
    console.log('Attempting signup with:', signupData);

    try {
      const newUser = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({
          ...signupData,
          createdDate: new Date().toISOString()
        }),
      });

      console.log('Signup successful:', newUser);
      setCurrentUser(newUser);
      setView('home');
      setMessage({ type: 'success', text: `Account created! Welcome, ${newUser.username}!` });
    } catch (e) {
      console.error('Signup error:', e);
      setMessage({ type: 'error', text: `Signup failed: ${e.message}` });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    sessionStorage.clear(); // Clear session storage on logout
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

      <Sidebar
        view={view}
        setView={setView}
        currentUser={currentUser}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

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