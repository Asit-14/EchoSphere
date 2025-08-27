import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        if (userData?.username) {
          setUserName(userData.username);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
    
    // Set greeting based on time of day
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);
  
  return (
    <Container>
      <div className="welcome-container">
        <div className="avatar-container">
          <img src={Robot} alt="Robot welcome" className="welcome-avatar" />
          <div className="avatar-glow"></div>
        </div>
        
        <div className="welcome-content">
          <div className="welcome-header">
            <h1>
              {greeting}, <span className="username">{userName}</span>
            </h1>
            <p className="welcome-subtitle">Welcome to your EchoSphere</p>
          </div>
          
          <div className="welcome-message">
            <p>Select a contact to start a conversation</p>
            <div className="features">
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span>End-to-End Encrypted</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <span>Real-time Messaging</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🌐</span>
                <span>Cross-platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-primary);
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
  background-color: var(--background-light);
  
  .welcome-container {
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    animation: fadeIn 0.8s ease-out;
    
    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
    }
  }
  
  .avatar-container {
    position: relative;
    margin-bottom: 1rem;
    
    .welcome-avatar {
      height: 12rem;
      width: 12rem;
      border-radius: 50%;
      padding: 1rem;
      background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(0, 180, 216, 0.2));
      border: 2px solid rgba(255, 255, 255, 0.1);
      box-shadow: var(--box-shadow);
      z-index: 2;
      position: relative;
      object-fit: cover;
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
        border: 2px solid var(--primary-color);
      }
    }
    
    .avatar-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: radial-gradient(circle, var(--primary-light) 0%, transparent 70%);
      filter: blur(20px);
      opacity: 0.3;
      z-index: 1;
      animation: pulse 4s infinite;
    }
  }
  
  .welcome-content {
    text-align: center;
    
    @media (min-width: 768px) {
      text-align: left;
    }
  }
  
  .welcome-header {
    margin-bottom: 2rem;
    
    h1 {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(to right, var(--primary-light), var(--secondary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      
      .username {
        color: var(--accent-color);
        -webkit-text-fill-color: var(--accent-color);
      }
    }
    
    .welcome-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      font-weight: 300;
    }
  }
  
  .welcome-message {
    background: rgba(45, 45, 63, 0.5);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    
    p {
      margin-bottom: 1.5rem;
      font-size: 1rem;
      color: var(--text-secondary);
    }
  }
  
  .features {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    
    @media (min-width: 768px) {
      justify-content: flex-start;
    }
    
    .feature {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.05);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      transition: var(--transition-fast);
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }
      
      .feature-icon {
        font-size: 1.2rem;
      }
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.9); }
    50% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.1); }
    100% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.9); }
  }
`;
