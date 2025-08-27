import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/echosphere-logo.svg";
import { useNavigate } from "react-router-dom";
import { getAvatarUrl } from "../utils/helpers";

export default function Contacts({ contacts, changeChat, socket }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [isContactsVisible, setIsContactsVisible] = useState(true);
  const [contactsData, setContactsData] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const navigate = useNavigate();
  
  // Initial user data load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        if (data) {
          setCurrentUserName(data.username);
          setCurrentUserImage(data.avatarImage);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, []);
  
  // Process contacts data
  useEffect(() => {
    setContactsData(contacts);
  }, [contacts]);
  
  // Listen for socket events for avatar updates
  useEffect(() => {
    if (socket) {
      socket.on("avatar-updated", (data) => {
        // Update contactsData if the avatar of any contact has changed
        setContactsData(prev => 
          prev.map(contact => 
            contact._id === data.userId 
              ? { ...contact, avatarImage: data.avatarImage } 
              : contact
          )
        );
        
        // Also update current user's avatar if it's their update
        const currentUser = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        
        if (currentUser && currentUser._id === data.userId) {
          setCurrentUserImage(data.avatarImage);
          // Update localStorage
          localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify({
              ...currentUser,
              avatarImage: data.avatarImage
            })
          );
        }
      });
    }
    
    return () => {
      if (socket) {
        socket.off("avatar-updated");
      }
    };
  }, [socket]);
  
  // Listen for online/offline status changes
  useEffect(() => {
    if (socket) {
      // Listen for status changes of individual users
      socket.on("user-status-change", (data) => {
        if (data.status === "online") {
          setOnlineUsers(prev => new Set([...prev, data.userId]));
        } else {
          setOnlineUsers(prev => {
            const newSet = new Set([...prev]);
            newSet.delete(data.userId);
            return newSet;
          });
        }
      });
      
      // Get initial list of online users
      socket.on("get-online-users", (onlineUsersList) => {
        setOnlineUsers(new Set(onlineUsersList));
      });
    }
    
    return () => {
      if (socket) {
        socket.off("user-status-change");
        socket.off("get-online-users");
      }
    };
  }, [socket]);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
    // On mobile, hide contacts after selection
    if (window.innerWidth <= 768) {
      setIsContactsVisible(false);
    }
  };
  
  // Filter contacts based on search term
  const filteredContacts = contactsData.filter(contact => 
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Toggle contacts visibility on mobile
  const toggleContactsVisibility = () => {
    setIsContactsVisible(!isContactsVisible);
  };
  
  return (
    <>
      {currentUserImage && currentUserName && (
        <Container className={isContactsVisible ? "" : "hidden-on-mobile"}>
          <div className="brand">
            <img src={Logo} alt="EchoSphere logo" />
            <h3>EchoSphere</h3>
            
            {/* Mobile toggle button */}
            <button 
              className="mobile-toggle" 
              onClick={toggleContactsVisibility}
              aria-label="Toggle contacts"
            >
              <span></span>
            </button>
          </div>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search contacts"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="contacts-header">
            <h4>Conversations</h4>
            <span className="contact-count">{filteredContacts.length}</span>
          </div>
          
          <div className="contacts" role="listbox">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact, index) => {
                return (
                  <div
                    key={contact._id}
                    className={`contact ${
                      index === currentSelected ? "selected" : ""
                    }`}
                    onClick={() => changeCurrentChat(index, contact)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        changeCurrentChat(index, contact);
                      }
                    }}
                    tabIndex="0"
                    role="option"
                    aria-selected={index === currentSelected}
                  >
                    <div className="avatar">
                      <img
                        src={getAvatarUrl(contact.avatarImage)}
                        alt={`${contact.username}'s avatar`}
                        onError={(e) => {
                          console.error("Failed to load avatar image");
                          // Use a simple colored circle with first letter of username as fallback
                          const colors = ["#3498db", "#e74c3c", "#2ecc71", "#9b59b6"];
                          const colorIndex = contact.username.charCodeAt(0) % colors.length;
                          const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${colors[colorIndex]}"/><text x="50" y="62" font-family="Arial" font-size="40" text-anchor="middle" fill="white">${contact.username[0].toUpperCase()}</text></svg>`;
                          e.target.src = fallbackSvg;
                        }}
                      />
                      <span className={`status-indicator ${onlineUsers.has(contact._id) ? 'online' : 'offline'}`}></span>
                    </div>
                    <div className="contact-info">
                      <h3 className="username">{contact.username}</h3>
                      <p className="status-text">{onlineUsers.has(contact._id) ? 'Online' : 'Offline'}</p>
                      <p className="last-message">Click to start chatting</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-contacts">
                <p>No contacts found</p>
              </div>
            )}
          </div>
          
          <div className="current-user">
            <div className="avatar" onClick={() => navigate("/profile")}>
              <img
                src={getAvatarUrl(currentUserImage)}
                alt={`${currentUserName}'s avatar`}
                onError={(e) => {
                  console.error("Failed to load avatar image");
                  // Use a simple colored circle with first letter of username as fallback
                  const colors = ["#3498db", "#e74c3c", "#2ecc71", "#9b59b6"];
                  const colorIndex = currentUserName.charCodeAt(0) % colors.length;
                  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${colors[colorIndex]}"/><text x="50" y="62" font-family="Arial" font-size="40" text-anchor="middle" fill="white">${currentUserName[0].toUpperCase()}</text></svg>`;
                  e.target.src = fallbackSvg;
                }}
              />
              <span className="status-indicator online self"></span>
            </div>
            <div className="user-info">
              <h2>{currentUserName}</h2>
              <span className="user-status">Online</span>
            </div>
            <button className="settings-button" aria-label="User settings">
              ⚙️
            </button>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
  overflow: hidden;
  background-color: var(--background-medium);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  /* Mobile styling */
  @media screen and (max-width: 768px) {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 280px;
    z-index: 100;
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
    height: 100%;
    
    &.hidden-on-mobile {
      transform: translateX(-100%);
    }
  }
  
  @media screen and (max-width: 480px) {
    width: 100%;
    
    &.hidden-on-mobile {
      display: none;
    }
  }
  
  .brand {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    
    img {
      height: 2.2rem;
      filter: drop-shadow(0 0 5px rgba(138, 43, 226, 0.5));
    }
    
    h3 {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 1.4rem;
      background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-right: auto;
      margin-left: 0.8rem;
    }
    
    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 1.5rem;
      cursor: pointer;
      padding: 5px;
      
      @media screen and (max-width: 768px) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        
        span, span::before, span::after {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--text-primary);
          position: relative;
          transition: all 0.3s ease;
        }
        
        span::before, span::after {
          content: '';
          position: absolute;
        }
        
        span::before {
          top: -6px;
        }
        
        span::after {
          top: 6px;
        }
      }
    }
  }
  
  .search-container {
    padding: 1rem 1.5rem;
    position: relative;
    
    input {
      width: 100%;
      padding: 0.8rem 1rem 0.8rem 2.5rem;
      border-radius: 8px;
      border: none;
      background-color: rgba(255, 255, 255, 0.08);
      color: var(--text-primary);
      font-size: 0.9rem;
      transition: var(--transition-fast);
      
      &:focus {
        outline: none;
        background-color: rgba(255, 255, 255, 0.12);
        box-shadow: 0 0 0 2px rgba(138, 43, 226, 0.3);
      }
      
      &::placeholder {
        color: var(--text-tertiary);
      }
    }
    
    .search-icon {
      position: absolute;
      left: 2rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-tertiary);
      font-size: 0.9rem;
      pointer-events: none;
    }
  }
  
  .contacts-header {
    padding: 0.5rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h4 {
      color: var(--text-tertiary);
      font-size: 0.9rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .contact-count {
      background-color: var(--background-light);
      color: var(--text-tertiary);
      font-size: 0.8rem;
      padding: 0.2rem 0.5rem;
      border-radius: 10px;
    }
  }
  
  .contacts {
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    overflow-y: auto;
    gap: 0.5rem;
    
    .contact {
      background-color: rgba(255, 255, 255, 0.05);
      cursor: pointer;
      border-radius: 12px;
      padding: 0.8rem;
      display: flex;
      gap: 0.8rem;
      align-items: center;
      transition: var(--transition-normal);
      
      &:hover, &:focus {
        background-color: rgba(255, 255, 255, 0.08);
        transform: translateX(3px);
      }
      
      .avatar {
        position: relative;
        height: 3rem;
        width: 3rem;
        border-radius: 50%;
        overflow: hidden;
        
        img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
          object-fit: cover;
          background-color: rgba(255, 255, 255, 0.2);
          border: 2px solid transparent;
          transition: all 0.3s ease;
          padding: 0.2rem;
          
          &:hover {
            border: 2px solid var(--primary-color);
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
          }
        }
        
        .status-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--background-medium);
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease;
          
          &.online {
            background-color: var(--success);
            animation: pulse 2s infinite;
          }
          
          &.offline {
            background-color: var(--text-tertiary);
          }
          
          &.away {
            background-color: var(--warning);
          }
          
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4);
            }
            70% {
              box-shadow: 0 0 0 5px rgba(74, 222, 128, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
            }
          }
        }
      }
      
      .contact-info {
        flex: 1;
        overflow: hidden;
        
        .username {
          color: var(--text-primary);
          font-size: 1rem;
          margin-bottom: 0.2rem;
          font-weight: 500;
        }
        
        .status-text {
          color: var(--text-secondary);
          font-size: 0.75rem;
          margin-bottom: 0.2rem;
        }
        
        .last-message {
          color: var(--text-tertiary);
          font-size: 0.8rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    
    .selected {
      background: linear-gradient(to right, rgba(138, 43, 226, 0.3), rgba(0, 180, 216, 0.2));
      border-left: 3px solid var(--primary-color);
      
      .avatar img {
        border-color: var(--primary-light);
      }
      
      .username {
        color: var(--primary-light) !important;
      }
    }
    
    .no-contacts {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
      color: var(--text-tertiary);
      font-style: italic;
    }
  }

  .current-user {
    background-color: rgba(13, 13, 48, 0.6);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    
    .avatar {
      position: relative;
      height: 2.8rem;
      width: 2.8rem;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        object-fit: cover;
        background-color: rgba(255, 255, 255, 0.2);
        border: 2px solid var(--primary-color);
        padding: 0.2rem;
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(138, 43, 226, 0.7);
        }
      }
      
      .status-indicator.self {
        border-color: rgba(13, 13, 48, 0.6);
        width: 12px;
        height: 12px;
        bottom: 2px;
        right: 2px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
        animation: pulse 2s infinite;
      }
    }
    
    .user-info {
      flex: 1;
      margin-left: 0.8rem;
      
      h2 {
        color: var(--text-primary);
        font-size: 1rem;
        font-weight: 500;
      }
      
      .user-status {
        color: var(--success);
        font-size: 0.75rem;
      }
    }
    
    .settings-button {
      background: none;
      border: none;
      color: var(--text-tertiary);
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: var(--transition-fast);
      
      &:hover, &:focus {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
      }
    }
  }
`;
