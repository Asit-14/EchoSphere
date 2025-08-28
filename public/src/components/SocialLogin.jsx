import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { googleAuthRoute, githubAuthRoute, facebookAuthRoute } from '../utils/APIRoutes';

const SocialLogin = () => {
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Check for OAuth errors in URL
    const params = new URLSearchParams(location.search);
    const oauthError = params.get('error');
    
    if (oauthError) {
      let errorMessage = 'Authentication failed';
      
      switch (oauthError) {
        case 'google_not_configured':
          errorMessage = 'Google login is not configured on the server';
          break;
        case 'github_not_configured':
          errorMessage = 'GitHub login is not configured on the server';
          break;
        case 'facebook_not_configured':
          errorMessage = 'Facebook login is not configured on the server';
          break;
        case 'google_auth_failed':
        case 'github_auth_failed':
        case 'facebook_auth_failed':
          errorMessage = 'Authentication failed. Please try again.';
          break;
        default:
          errorMessage = `Authentication error: ${oauthError}`;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [location]);

  // Handle API URLs for social login more robustly
  const handleSocialLogin = (provider) => {
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const endpoint = `/api/auth/${provider}`;
    const fullUrl = apiUrl + endpoint;
    
    console.log(`Redirecting to ${provider} login at ${fullUrl}`);
    window.location.href = fullUrl;
  };

  return (
    <Container>
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <p className="error-help">
            Social login is currently not configured. Please use email/password login or check the documentation to set up social login.
          </p>
        </div>
      )}
      <div className="social-login">
        <SocialButton
          className="google-btn"
          onClick={() => handleSocialLogin('google')}
        >
          <i className="fab fa-google"></i>
          <span>Google</span>
        </SocialButton>

        <SocialButton
          className="github-btn"
          onClick={() => handleSocialLogin('github')}
        >
          <i className="fab fa-github"></i>
          <span>GitHub</span>
        </SocialButton>

        <SocialButton
          className="facebook-btn"
          onClick={() => handleSocialLogin('facebook')}
        >
          <i className="fab fa-facebook-f"></i>
          <span>Facebook</span>
        </SocialButton>
      </div>
      <div className="setup-note">
        <p>Note: To enable social login, please follow instructions in <code>SOCIAL_LOGIN_SETUP.md</code></p>
      </div>
      <div 
        className="signature"
        onClick={() => toast.info("EchoSphere Social Login by Asit, 2025", {
          position: "bottom-center",
          autoClose: 3000
        })}
        title="Created by Asit"
      >
        Crafted by Asit <span className="sparkle">✨</span>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  
  .error-message {
    background: rgba(231, 76, 60, 0.1);
    border: 1px solid rgba(231, 76, 60, 0.3);
    border-radius: 6px;
    padding: 0.8rem;
    margin-bottom: 1rem;
    text-align: center;
    
    p {
      color: #e74c3c;
      margin: 0;
      font-size: 0.9rem;
    }
    
    .error-help {
      color: #ddd;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }
  }
  
  .setup-note {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    
    code {
      background: rgba(255, 255, 255, 0.1);
      padding: 2px 5px;
      border-radius: 3px;
    }
  }
  
  .signature {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
    letter-spacing: 0.5px;
    opacity: 0.8;
    transition: all 0.3s ease;
    padding: 4px 8px;
    border-radius: 12px;
    cursor: pointer;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.06) 100%);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    
    &:hover {
      color: rgba(255, 255, 255, 0.6);
      transform: translateY(-1px);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.08) 100%);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
    
    &:active {
      transform: translateY(0px);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .sparkle {
      display: inline-block;
      margin-left: 2px;
      animation: sparkle 1.5s infinite alternate;
    }
    
    @keyframes sparkle {
      0% {
        opacity: 0.5;
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1.1);
      }
    }
  }
  
  .social-login {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0;
    
    @media screen and (max-width: 480px) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  
  i {
    font-size: 1.2rem;
  }
  
  &.google-btn {
    background: #4285F4;
    color: white;
    
    &:hover {
      background: #357ae8;
    }
  }
  
  &.github-btn {
    background: #333;
    color: white;
    
    &:hover {
      background: #2b2b2b;
    }
  }
  
  &.facebook-btn {
    background: #3b5998;
    color: white;
    
    &:hover {
      background: #344e86;
    }
  }
  
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

export default SocialLogin;
