import React from 'react';
import styled from 'styled-components';
import OAuthPopup from 'react-oauth-popup';
import { googleAuthRoute, githubAuthRoute, facebookAuthRoute } from '../utils/APIRoutes';

const SocialLogin = () => {
  // Handle OAuth popup window opening
  const onCode = (code, params) => {
    console.log('Authorization code:', code);
    console.log('Parameters:', params);
  };

  // Handle OAuth popup window closing
  const onClose = () => {
    console.log('OAuth popup was closed');
  };

  return (
    <Container>
      <div className="social-login">
        <SocialButton
          className="google-btn"
          onClick={() => window.location.href = googleAuthRoute}
        >
          <i className="fab fa-google"></i>
          <span>Google</span>
        </SocialButton>

        <SocialButton
          className="github-btn"
          onClick={() => window.location.href = githubAuthRoute}
        >
          <i className="fab fa-github"></i>
          <span>GitHub</span>
        </SocialButton>

        <SocialButton
          className="facebook-btn"
          onClick={() => window.location.href = facebookAuthRoute}
        >
          <i className="fab fa-facebook-f"></i>
          <span>Facebook</span>
        </SocialButton>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  
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
