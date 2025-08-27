import React, { useState, useRef } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { uploadAvatarRoute } from "../utils/APIRoutes";

export default function AvatarUpload({ currentUser, refreshUser }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // File validation
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, or GIF)", toastOptions);
      return;
    }
    
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum size is 5MB", toastOptions);
      return;
    }
    
    // Upload the file
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);
      
      const response = await axios.post(
        `${uploadAvatarRoute}/${currentUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (response.data.status) {
        // Update the user in local storage
        const userData = response.data.user;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(userData)
        );
        
        // Call the refreshUser function to update the UI
        if (refreshUser) {
          refreshUser(userData);
        }
        
        // Emit avatar change event to update other components via socket
        // We can't access socket directly here, but the update will happen via server broadcast
        
        toast.success("Avatar updated successfully!", toastOptions);
      } else {
        toast.error(response.data.msg || "Failed to update avatar", toastOptions);
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("An error occurred while uploading the avatar", toastOptions);
    } finally {
      setIsUploading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <Container>
      <div className="upload-button" onClick={triggerFileInput} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Image"}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .upload-button {
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 0.7rem 1.5rem;
    border: none;
    border-radius: 2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 1rem 0;
    text-align: center;
    font-size: 0.9rem;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;
