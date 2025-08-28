import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const SocialLogin = () => {

  return (
    <Container>
      <div className="divider-text">
        <span>Secure Authentication</span>
      </div>
      <div 
        className="signature"
        onClick={() => toast.info("EchoSphere by Asit, 2025", {
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
  
  .divider-text {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1.5rem 0;
    
    &::before, &::after {
      content: "";
      flex: 1;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    span {
      padding: 0 10px;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
  }
  
  .signature {
    margin-top: 1rem;
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
`;

export default SocialLogin;
