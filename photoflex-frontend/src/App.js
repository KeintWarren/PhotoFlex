import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MessageBar from './components/MessageBar';
import LogoutConfirmationModal from './components/LogoutConfirmationModal';

const API_URL = 'http://localhost:8080/api';

// Protected Route Component
function ProtectedRoute({ children, currentUser }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Auth Route Component (redirects to home if already logged in)
function AuthRoute({ children, currentUser }) {
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

// Main App Layout Component
function AppLayout({
  currentUser,
  setCurrentUser,
  apiFetch,
  message,
  setMessage,
  handleLogoutClick,
  showLogoutConfirm,
  handleLogoutConfirm,
  handleLogoutCancel
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased flex">
      <MessageBar message={message} setMessage={setMessage} />

      <Sidebar
        currentUser={currentUser}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        navigate={navigate}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogoutClick}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 p-4 md:p-8">
          <Routes>
            <Route
              path="/home"
              element={
                <Homepage
                  currentUser={currentUser}
                  apiFetch={apiFetch}
                  setMessage={setMessage}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  currentUser={currentUser}
                  apiFetch={apiFetch}
                  setMessage={setMessage}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Settings
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  apiFetch={apiFetch}
                  setMessage={setMessage}
                />
              }
            />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <LogoutConfirmationModal
          currentUser={currentUser}
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </div>
  );
}

// Main App Component
export default function App() {
  // Initialize currentUser from sessionStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [message, setMessage] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Save user to sessionStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }, [currentUser]);

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

  const handleLogin = async (loginData, navigate) => {
    setMessage(null);
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      });

      if (response?.user) {
        setCurrentUser(response.user);
        setMessage({ type: 'success', text: response.message || `Welcome back, ${response.user.username}!` });
        navigate('/home');
      } else {
        setMessage({ type: 'error', text: 'Invalid email or password.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: `Login failed: ${e.message}` });
    }
  };

  const handleSignup = async (signupData, navigate) => {
    setMessage(null);
    console.log('Attempting signup with:', signupData);

    try {
      const response = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(signupData),
      });

      if (response?.user) {
        console.log('Signup successful:', response.user);
        setCurrentUser(response.user);
        setMessage({ type: 'success', text: response.message || `Account created! Welcome, ${response.user.username}!` });
        navigate('/home');
      } else {
        setMessage({ type: 'error', text: 'Signup failed. Please try again.' });
      }
    } catch (e) {
      console.error('Signup error:', e);
      setMessage({ type: 'error', text: `Signup failed: ${e.message}` });
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setCurrentUser(null);
    sessionStorage.clear();
    setShowLogoutConfirm(false);
    setMessage({ type: 'info', text: 'You have been logged out.' });
    // Navigation will happen automatically via AuthRoute redirect
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <BrowserRouter>
      <div className="font-sans antialiased">
        <MessageBar message={message} setMessage={setMessage} />

        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthRoute currentUser={currentUser}>
                <Login onLogin={handleLogin} />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute currentUser={currentUser}>
                <Signup onSignup={handleSignup} />
              </AuthRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <AppLayout
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  apiFetch={apiFetch}
                  message={message}
                  setMessage={setMessage}
                  handleLogoutClick={handleLogoutClick}
                  showLogoutConfirm={showLogoutConfirm}
                  handleLogoutConfirm={handleLogoutConfirm}
                  handleLogoutCancel={handleLogoutCancel}
                />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}