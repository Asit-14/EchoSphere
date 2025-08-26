import React, { useState, useEffect } from "react";
import styled from "styled-components";

export default function AvatarTester() {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    const loadAvatars = async () => {
      setIsLoading(true);
      try {
        // Attempt to load 4 avatars from the picture folder
        const imagePromises = [];
        
        // Create paths for the images in the picture folder (adjust based on your folder structure)
        for (let i = 1; i <= 4; i++) {
          const path = `/picture/avatar${i}.png`;
          imagePromises.push(path);
        }
        
        setAvatars(imagePromises);
      } catch (error) {
        console.error("Error loading avatars:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAvatars();
  }, []);

  const handleSelect = (index) => {
    setSelectedAvatar(index);
  };

  return (
    <Container>
      <h2>Avatar Tester</h2>
      
      {isLoading ? (
        <div className="loading">
          <p>Loading Avatars...</p>
        </div>
      ) : (
        <div className="avatars">
          {avatars.map((avatar, index) => (
            <div 
              key={index}
              className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
              onClick={() => handleSelect(index)}
            >
              <img 
                src={avatar} 
                alt={`Avatar Option ${index + 1}`} 
              />
            </div>
          ))}
        </div>
      )}
      
      {selectedAvatar !== null && (
        <div className="preview">
          <h3>Selected Avatar Preview</h3>
          <div className="avatar-preview">
            <img 
              src={avatars[selectedAvatar]} 
              alt="Selected Avatar" 
            />
          </div>
          <p>Path: {avatars[selectedAvatar]}</p>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  padding: 3rem 0;
  
  h2 {
    color: white;
  }
  
  .loading {
    color: white;
  }
  
  .avatars {
    display: flex;
    gap: 2rem;
    
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      cursor: pointer;
      
      img {
        height: 6rem;
        width: 6rem;
        border-radius: 50%;
        object-fit: contain;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 0.2rem;
      }
      
      &.selected {
        border: 0.4rem solid #4e0eff;
      }
    }
  }
  
  .preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
    
    h3 {
      color: white;
      margin-bottom: 1rem;
    }
    
    .avatar-preview {
      border: 0.4rem solid #4e0eff;
      border-radius: 50%;
      padding: 0.4rem;
      
      img {
        height: 10rem;
        width: 10rem;
        border-radius: 50%;
        object-fit: contain;
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
    
    p {
      color: white;
      margin-top: 1rem;
    }
  }
`;
