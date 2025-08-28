import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  const handleKeyDown = (e) => {
    // Send message on Enter (but not with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat(e);
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          value={msg}
          autoFocus
        />
        <button type="submit" disabled={msg.trim().length === 0}>
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: var(--background-dark);
  padding: 0.8rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  margin-top: auto;
  
  @media screen and (max-width: 1080px) {
    padding: 0.8rem 1rem;
    gap: 0.5rem;
  }
  
  @media screen and (max-width: 480px) {
    grid-template-columns: 10% 90%;
    padding: 0.8rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 100;
    background-color: var(--background-dark);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    
    .emoji {
      position: relative;
      
      svg {
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
        transition: color 0.2s ease;
        
        &:hover {
          color: var(--primary-color);
        }
      }
      
      .emoji-picker-react {
        position: absolute;
        bottom: 60px;
        left: 0;
        background-color: var(--background-light);
        box-shadow: var(--box-shadow);
        border-color: var(--primary-color);
        border-radius: 10px;
        z-index: 20;
        
        @media screen and (max-width: 480px) {
          bottom: 70px;
          left: -40px;
          width: 280px !important;
        }
        
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: var(--background-light);
          width: 5px;
          
          &-thumb {
            background-color: var(--primary-color);
          }
        }
        
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        
        .emoji-search {
          background-color: rgba(0, 0, 0, 0.2);
          border-color: var(--primary-color);
        }
        
        .emoji-group:before {
          background-color: var(--background-light);
        }
      }
    }
  }
  
  .input-container {
    width: 100%;
    border-radius: 24px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 0.2rem 0.3rem;
    transition: box-shadow 0.3s ease;
    max-width: 100%;
    
    @media screen and (max-width: 480px) {
      border-radius: 20px;
      padding: 0.15rem 0.3rem;
    }
    margin-bottom: 0;
    
    &:focus-within {
      box-shadow: 0 0 0 2px rgba(154, 134, 243, 0.3);
    }
    
    input {
      width: 100%;
      background-color: transparent;
      color: var(--text-primary);
      border: none;
      padding: 0.8rem 1rem;
      font-size: 1rem;
      
      &::placeholder {
        color: var(--text-tertiary);
      }
      
      &::selection {
        background-color: var(--primary-color);
      }
      
      &:focus {
        outline: none;
      }
    }
    
    button {
      padding: 0.5rem;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      border: none;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      svg {
        font-size: 1.5rem;
        color: white;
      }
      
      @media screen and (max-width: 480px) {
        width: 38px;
        height: 38px;
        
        svg {
          font-size: 1.2rem;
        }
      }
    }
  }
`;
