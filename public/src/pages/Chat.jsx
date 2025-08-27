import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        const userData = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        setCurrentUser(userData);
      }
    };
    checkUser();
  }, [navigate]);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
            setContacts(data);
          } catch (error) {
            console.error("Error fetching contacts:", error);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
    
    fetchContacts();
  }, [currentUser, navigate]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} socket={socket.current} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <>
              <div className="mobile-toggle-container">
                <button 
                  className="mobile-contacts-toggle" 
                  onClick={() => document.querySelector('.contacts').classList.toggle('hidden-on-mobile')}
                  aria-label="Show contacts"
                >
                  <i className="fas fa-users"></i>
                </button>
              </div>
              <ChatContainer currentChat={currentChat} socket={socket.current} />
            </>
          )}
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--background-medium) 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  
  /* Animated background effect */
  &::before {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    z-index: -1;
    background: radial-gradient(circle, var(--primary-color) 0%, transparent 8%), 
                radial-gradient(circle, var(--secondary-color) 0%, transparent 6%);
    background-size: 30px 30px;
    opacity: 0.1;
    animation: moveBackground 120s linear infinite;
  }

  @keyframes moveBackground {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100px) rotate(10deg); }
  }
  
  .mobile-toggle-container {
    display: none;
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 101;
    
    @media screen and (max-width: 768px) {
      display: block;
    }
    
    .mobile-contacts-toggle {
      background: rgba(30, 30, 46, 0.8);
      border: none;
      color: var(--text-primary);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--primary-color);
      }
    }
  }

  .container {
    height: 85vh;
    width: 90vw;
    max-width: 1400px;
    background-color: rgba(30, 30, 46, 0.8);
    backdrop-filter: blur(10px);
    display: grid;
    grid-template-columns: 320px 1fr;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: var(--box-shadow);
    transition: var(--transition-normal);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    /* Glass effect border */
    border: 1px solid rgba(255, 255, 255, 0.08);
    
    /* Responsive grid layouts */
    @media screen and (max-width: 1280px) {
      grid-template-columns: 280px 1fr;
      width: 95vw;
    }
    
    @media screen and (max-width: 1024px) {
      grid-template-columns: 250px 1fr;
    }
    
    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      height: 95vh;
      width: 95vw;
    }
    
    @media screen and (max-width: 600px) {
      height: 100vh;
      width: 100vw;
      border-radius: 8px;
    }
    
    @media screen and (max-width: 480px) {
      height: 100vh;
      width: 100vw;
      border-radius: 0;
      grid-template-rows: auto 1fr;
    }
    
    .mobile-toggle-container {
      position: absolute;
      top: 1rem;
      left: 1rem;
      z-index: 200;
      display: none;
      
      @media screen and (max-width: 768px) {
        display: block;
      }
      
      .mobile-contacts-toggle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(30, 30, 46, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: var(--box-shadow);
      }
    }
    
    /* For very small devices */
    @media screen and (max-height: 500px) {
      height: 100vh;
      grid-template-rows: auto 1fr;
    }
  }
`;
