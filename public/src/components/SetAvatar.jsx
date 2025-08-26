import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

// Component to handle avatar image loading and errors
const AvatarPreviewImage = ({ src, index }) => {
  // Using setImgLoaded in handleLoad function to avoid unused variable warning
  const [, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  const handleLoad = () => {
    setImgLoaded(true);
    // Removed console.log for production
  };
  
  const handleError = () => {
    console.error(`Failed to load avatar image ${index + 1}:`, src);
    setImgError(true);
  };
  
  return (
    <>
      {imgError ? (
        // Use a SVG fallback similar to Contacts component
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100"
          className="avatar-fallback"
        >
          <circle cx="50" cy="50" r="45" fill={
            ["#3498db", "#e74c3c", "#2ecc71", "#9b59b6"][index % 4]
          } />
          <text x="50" y="62" 
            fontFamily="Arial" 
            fontSize="40" 
            textAnchor="middle" 
            fill="white"
          >
            {(index + 1).toString()}
          </text>
        </svg>
      ) : (
        <img 
          src={src} 
          alt={`Avatar option ${index + 1}`}
          className="small-preview"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </>
  );
};
export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    // Check if the user is logged in
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      try {
        const user = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );

        if (!user || !user._id) {
          toast.error("User session not found. Please login again.", toastOptions);
          navigate("/login");
          return;
        }

        // Show loading state
        setIsLoading(true);
        
        // Get the selected inline SVG avatar
        // We're still using the image path stored in the avatars array
        const selectedAvatarUrl = avatars[selectedAvatar];
        // Removed console.log for production
        
        try {
          // Send the image URL to the server
          const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
            image: selectedAvatarUrl
          });
          
          if (data.isSet) {
            user.isAvatarImageSet = true;
            user.avatarImage = selectedAvatarUrl;
            localStorage.setItem(
              process.env.REACT_APP_LOCALHOST_KEY,
              JSON.stringify(user)
            );
            toast.success("Avatar set successfully!", toastOptions);
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            throw new Error("Failed to set avatar on the server");
          }
        } catch (error) {
          console.error("Error saving avatar:", error);
          toast.error("Failed to set avatar. Please try again.", toastOptions);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in avatar processing:", error);
        toast.error(
          "Error processing avatar. Please try again.", 
          toastOptions
        );
        setIsLoading(false);
      }
    }
  };

  // Define avatar data 
  useEffect(() => {
    const loadAvatars = async () => {
      try {
        setIsLoading(true);
        
        // Load all 9 avatar images from the picture folder
        const avatarArray = [];
        const numberOfAvatars = 9;
        
        for (let i = 1; i <= numberOfAvatars; i++) {
          // Try with the direct path to the public folder
          avatarArray.push(`/picture/avatar${i}.png`);
        }
        
        // Removed console.log statements for production
        setAvatars(avatarArray);
        setIsLoading(false);
      } catch (error) {
        console.error("Error setting avatars:", error);
        toast.error("Failed to load avatars. Please try refreshing.", toastOptions);
        setIsLoading(false);
      }
    };
    
    loadAvatars();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={`avatar-${index}`}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                  onClick={() => setSelectedAvatar(index)}
                >
                  <div className="avatar-preview">
                    <AvatarPreviewImage 
                      src={avatar}
                      index={index} 
                    />
                  </div>
                  <div className="avatar-label">
                    Avatar<br />option {index + 1}
                    {selectedAvatar === index && (
                      <div className="selected-indicator">✓</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2.5rem;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--background-medium) 100%);
  min-height: 100vh;
  width: 100%;
  padding: 2rem;
  
  --primary-color-transparent: rgba(138, 43, 226, 0.5);
  --secondary-color-transparent: rgba(30, 144, 255, 0.5);

  /* Animated background effect */
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    z-index: -1;
    background: radial-gradient(circle, var(--primary-color) 0%, transparent 10%), 
                radial-gradient(circle, var(--secondary-color) 0%, transparent 8%);
    background-size: 30px 30px;
    opacity: 0.05;
    animation: floatBg 120s linear infinite;
  }

  @keyframes floatBg {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100px) rotate(10deg); }
  }

  .loader {
    max-width: 100px;
    filter: drop-shadow(0 0 10px var(--primary-light));
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0% { opacity: 0.6; transform: scale(0.98); }
      50% { opacity: 1; transform: scale(1.02); }
      100% { opacity: 0.6; transform: scale(0.98); }
    }
  }

  .title-container {
    text-align: center;
    
    h1 {
      color: var(--text-primary);
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      font-weight: 700;
      background: linear-gradient(to right, var(--primary-light), var(--secondary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
      padding: 0 1rem;
    }
  }
  
    .avatars {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    max-width: 800px;
    padding: 1rem;
    
    .avatar {
      border: 0.25rem solid rgba(255, 255, 255, 0.1);
      padding: 0.4rem;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: all var(--transition-normal);
      cursor: pointer;
      position: relative;
      background: rgba(40, 40, 50, 0.4);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      width: 120px;
      height: 150px;
      
      &:hover {
        transform: translateY(-3px);
        border-color: var(--primary-light);
        background-color: rgba(255, 255, 255, 0.08);
      }
      
      &:focus-within {
        outline: none;
        border-color: var(--primary-color);
      }
      
      .avatar-preview {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 12px;
        background-color: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        
        .small-preview {
          height: 100%;
          width: 100%;
          display: block;
          object-fit: contain;
          border-radius: 50%;
        }
        
        .avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      
      .avatar-label {
        color: var(--text-primary);
        font-size: 0.85rem;
        font-weight: 500;
        text-align: center;
        line-height: 1.3;
        position: relative;
        
        .selected-indicator {
          position: absolute;
          top: -8px;
          right: -12px;
          color: var(--primary-light);
          font-size: 1.2rem;
          font-weight: bold;
        }
      }
      
      &.selected {
        border-color: var(--primary-color);
        background: linear-gradient(to right, rgba(138, 43, 226, 0.3), rgba(0, 180, 216, 0.2));
        transform: translateY(-5px);
        box-shadow: 0 6px 15px rgba(138, 43, 226, 0.4);
        
        .avatar-preview {
          border-color: var(--primary-light);
        }
      }
      
      &::after {
        content: '';
        position: absolute;
        inset: -3px;
        border-radius: 12px;
        z-index: -1;
        background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
        opacity: 0;
        transition: var(--transition-normal);
      }
      
      img {
        height: 100%;
        width: 100%;
        transition: var(--transition-normal);
        border-radius: 50%;
        object-fit: contain;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 0;
        
        &:focus {
          outline: none;
        }
      }
    }
    
    .selected {
      border-left: 3px solid var(--primary-color);
      transform: translateY(-3px);
      
      &::after {
        opacity: 0.8;
      }
      
      img {
        transform: scale(1.05);
        filter: drop-shadow(0 0 8px rgba(138, 43, 226, 0.4));
      }
      
      .avatar-label {
        color: var(--primary-light);
      }
    }
  }
  
  .submit-btn {
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 0.8rem 2.5rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    border-radius: 8px;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: var(--transition-normal);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
      transform: translateX(-100%);
    }
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: var(--box-shadow-hover);
      
      &::before {
        transform: translateX(100%);
        transition: transform 0.8s ease;
      }
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.3);
    }
  }
  
  /* Responsiveness */
  @media (max-width: 768px) {
    gap: 2rem;
    padding: 1rem;
    
    .title-container h1 {
      font-size: 1.4rem;
    }
    
    .avatars {
      gap: 1rem;
      
      .avatar {
        border-width: 0.2rem;
        padding: 0.3rem;
        width: 110px;
        height: 140px;
      }
      
      .avatar-preview {
        width: 60px;
        height: 60px;
      }
      
      .avatar-label {
        font-size: 0.75rem;
      }
    }
    
    .submit-btn {
      padding: 0.7rem 2rem;
      font-size: 0.9rem;
    }
  }
`;
