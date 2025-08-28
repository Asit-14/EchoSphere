import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OAuthCallback from "./pages/OAuthCallback";
import { getUserFromStorage } from "./utils/helpers";

// Navigation component
const Navigation = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in using our helper function
    const user = getUserFromStorage();
    setIsLoggedIn(!!user);
  }, [location.pathname]);
  
  // Don't show navigation on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }
  
  return (
    <NavContainer>
      <div className="logo">
        <Link to="/" aria-label="Home">
          EchoSphere
        </Link>
      </div>
      
      <nav>
        <ul>
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Chat
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link 
                to="/profile" 
                className={location.pathname === "/profile" ? "active" : ""}
              >
                Profile
              </Link>
            </li>
          )}
          {isLoggedIn ? (
            <li>
              <button 
                onClick={() => {
                  const userKey = process.env.REACT_APP_LOCALHOST_KEY || "echosphere-user";
                  localStorage.removeItem(userKey);
                  // Use history.push instead of window.location.href to avoid 404 on refresh
                  window.location.replace("/login");
                }}
                className="logout-button"
                aria-label="Logout"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      
      <button className="theme-toggle" aria-label="Toggle dark mode">
        🌙
      </button>
    </NavContainer>
  );
};

// Skip to content for accessibility
const SkipToContent = () => (
  <SkipLink href="#main-content">Skip to content</SkipLink>
);

export default function App() {
  // Add keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Add keyboard shortcuts
      if (e.altKey && e.key === 'h') {
        window.location.href = '/';
      }
      if (e.altKey && e.key === 'a') {
        window.location.href = '/setAvatar';
      }
      if (e.altKey && e.key === 'l') {
        window.location.href = '/login';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <BrowserRouter>
      <SkipToContent />
      <Navigation />
      <main id="main-content">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route path="/" element={<Chat />} />
        </Routes>
      </main>
      
      {/* Accessibility info - hidden visually but available to screen readers */}
      <div className="sr-only">
        <h2>Keyboard shortcuts</h2>
        <ul>
          <li>Alt+H: Go to home/chat</li>
          <li>Alt+A: Go to avatar selection</li>
          <li>Alt+L: Go to login</li>
        </ul>
      </div>
    </BrowserRouter>
  );
}

// Styled components
const NavContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--background-medium);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  // Only show on specific pages
  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
  }
  
  .logo {
    font-weight: 700;
    font-size: 1.5rem;
    
    a {
      text-decoration: none;
      background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      transition: var(--transition-fast);
      
      &:hover {
        filter: brightness(1.2);
      }
    }
  }
  
  nav {
    ul {
      display: flex;
      list-style: none;
      gap: 1.5rem;
      
      li {
        a, button {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: var(--transition-fast);
          padding: 0.5rem 0.8rem;
          border-radius: 6px;
          
          &:hover, &:focus {
            color: var(--text-primary);
            background-color: rgba(255, 255, 255, 0.05);
          }
          
          &.active {
            color: var(--primary-light);
            position: relative;
            
            &::after {
              content: '';
              position: absolute;
              bottom: -5px;
              left: 0;
              height: 2px;
              width: 100%;
              background: var(--primary-light);
              border-radius: 2px;
            }
          }
        }
        
        .logout-button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 0.5rem 0.8rem;
          
          &:hover {
            color: var(--danger);
          }
        }
      }
    }
  }
  
  .theme-toggle {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: var(--transition-fast);
    
    &:hover, &:focus {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--text-primary);
      transform: rotate(30deg);
    }
  }
`;

const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  z-index: 200;
  transition: top 0.3s;
  
  &:focus {
    top: 0;
  }
`;

// Add global styles
const globalStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  #main-content {
    margin-top: 4rem;
    min-height: calc(100vh - 4rem);
    width: 100%;
  }
  
  @media (max-width: 768px) {
    #main-content {
      margin-top: 3.5rem;
      min-height: calc(100vh - 3.5rem);
    }
  }
`;

// Create and append global styles
const styleElement = document.createElement('style');
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);
