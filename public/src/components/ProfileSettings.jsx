import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loader from "../assets/loader.gif";
import { updateUserRoute, changePasswordRoute, deleteAccountRoute } from "../utils/APIRoutes";
import AvatarUpload from "./AvatarUpload";
import { getAvatarUrl } from "../utils/helpers";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  
  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setUser(JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);
  
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setAge(user.age || "");
    }
  }, [user]);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handlePasswordToggle = () => {
    setIsChangingPassword(!isChangingPassword);
    // Clear password fields when toggling
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const validateForm = () => {
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters long", toastOptions);
      return false;
    }
    
    if (email.trim() === "") {
      toast.error("Email is required", toastOptions);
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email", toastOptions);
      return false;
    }
    
    if (age && isNaN(age)) {
      toast.error("Age must be a number", toastOptions);
      return false;
    }
    
    return true;
  };
  
  const validatePasswordForm = () => {
    if (currentPassword === "") {
      toast.error("Current password is required", toastOptions);
      return false;
    }
    
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long", toastOptions);
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", toastOptions);
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${updateUserRoute}/${user._id}`, {
        username,
        email,
        age: age || null,
      });
      
      if (data.status === true) {
        // Update local storage
        const updatedUser = { ...user, username, email, age: age || null };
        localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(updatedUser));
        
        setUser(updatedUser);
        setIsEditing(false);
        toast.success("Profile updated successfully", toastOptions);
      } else {
        toast.error(data.msg || "Failed to update profile", toastOptions);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred. Please try again.", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${changePasswordRoute}/${user._id}`, {
        currentPassword,
        newPassword,
      });
      
      if (data.status === true) {
        setIsChangingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password changed successfully", toastOptions);
      } else {
        toast.error(data.msg || "Failed to change password", toastOptions);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred. Please try again.", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangeAvatar = () => {
    navigate("/setAvatar");
  };
  
  const toggleDeleteConfirmation = () => {
    setIsConfirmingDelete(!isConfirmingDelete);
    setDeletePassword("");
  };
  
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (!deletePassword) {
      toast.error("Please enter your password to confirm account deletion", toastOptions);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Deleting account for user:", user._id);
      console.log("Delete account URL:", `${deleteAccountRoute}/${user._id}`);
      
      const { data } = await axios.post(`${deleteAccountRoute}/${user._id}`, {
        password: deletePassword,
      });
      
      console.log("Delete account response:", data);
      
      if (data.status === true) {
        toast.success("Your account has been deleted", toastOptions);
        localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.msg || "Failed to delete account", toastOptions);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.msg || "An error occurred. Please try again.", toastOptions);
      setIsLoading(false);
    }
  };
  
  const refreshUser = (updatedUser) => {
    setUser(updatedUser);
  };
  
  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="profile-header">
            <button className="back-button" onClick={() => navigate("/")}>
              <span className="back-icon">←</span> Back to Chat
            </button>
            <h1>Profile Settings</h1>
          </div>
          
          <div className="profile-content">
            <div className="avatar-section">
              <div className="avatar-container">
                {user?.avatarImage ? (
                  <img
                    src={getAvatarUrl(user.avatarImage)}
                    alt="Profile"
                    className="profile-avatar"
                    onError={(e) => {
                      console.error("Failed to load avatar image");
                      // Use a simple colored circle with first letter of username as fallback
                      const colors = ["#3498db", "#e74c3c", "#2ecc71", "#9b59b6"];
                      const colorIndex = user.username.charCodeAt(0) % colors.length;
                      const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${colors[colorIndex]}"/><text x="50" y="62" font-family="Arial" font-size="40" text-anchor="middle" fill="white">${user.username[0].toUpperCase()}</text></svg>`;
                      e.target.src = fallbackSvg;
                    }}
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.username ? user.username[0].toUpperCase() : "?"}
                  </div>
                )}
              </div>
              <div className="avatar-actions">
                <AvatarUpload currentUser={user} refreshUser={refreshUser} />
                <button className="change-avatar-btn" onClick={handleChangeAvatar}>
                  Select Preset Avatar
                </button>
              </div>
            </div>
            
            <div className="info-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                {!isEditing ? (
                  <button className="edit-btn" onClick={handleEditToggle}>
                    Edit Profile
                  </button>
                ) : null}
              </div>
              
              <form onSubmit={handleSubmit} className={isEditing ? "editing" : ""}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="age">Age (optional)</label>
                  <input
                    type="text"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                {isEditing && (
                  <div className="form-buttons">
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
              
              <div className="section-divider"></div>
              
              <div className="section-header">
                <h2>Security</h2>
                {!isChangingPassword ? (
                  <button className="edit-btn" onClick={handlePasswordToggle}>
                    Change Password
                  </button>
                ) : null}
              </div>
              
              {isChangingPassword && (
                <form onSubmit={handlePasswordChange} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="form-buttons">
                    <button type="submit" className="save-btn">
                      Update Password
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handlePasswordToggle}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              
              <div className="section-divider"></div>
              
              <div className="danger-zone">
                <h2>Danger Zone</h2>
                <div className="danger-actions">
                  <button className="logout-btn" onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}>
                    Log Out
                  </button>
                  
                  <button type="button" className="delete-btn" onClick={toggleDeleteConfirmation}>
                    Delete Account
                  </button>
                </div>
                
                {isConfirmingDelete && (
                  <div className="delete-account-confirmation">
                    <h3>⚠️ Delete Account Permanently</h3>
                    <p>This action cannot be undone. All your data, messages, and profile information will be permanently removed from our servers.</p>
                    
                    <form onSubmit={handleDeleteAccount} className="delete-account-form">
                      <div className="form-group">
                        <label htmlFor="deletePassword">Enter your password to confirm deletion:</label>
                        <input
                          type="password"
                          id="deletePassword"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="Enter your current password"
                          autoFocus
                          required
                        />
                      </div>
                      
                      <div className="form-buttons">
                        <button type="submit" className="confirm-delete-btn">
                          Permanently Delete My Account
                        </button>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={toggleDeleteConfirmation}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--background-medium) 100%);
  padding: 2rem;
  
  .loader {
    margin: auto;
    max-width: 100px;
    filter: drop-shadow(0 0 10px var(--primary-light));
    animation: pulse 2s infinite;
    
    @keyframes pulse {
      0% { opacity: 0.6; transform: scale(0.98); }
      50% { opacity: 1; transform: scale(1.02); }
      100% { opacity: 0.6; transform: scale(0.98); }
    }
  }
  
  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    position: relative;
    width: 100%;
    
    .back-button {
      position: absolute;
      left: 0;
      top: 0;
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0.5rem;
      
      &:hover {
        color: var(--primary-light);
      }
      
      .back-icon {
        margin-right: 0.5rem;
        font-size: 1.2rem;
      }
    }
    
    h1 {
      color: var(--text-primary);
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: 700;
      background: linear-gradient(to right, var(--primary-light), var(--secondary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  
  .profile-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    background: rgba(30, 30, 40, 0.6);
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    
    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
    }
  }
  
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    
    @media (min-width: 768px) {
      width: 30%;
    }
    
    .avatar-container {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid rgba(138, 43, 226, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(255, 255, 255, 0.1);
      
      .profile-avatar {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    
    .change-avatar-btn {
      background: rgba(138, 43, 226, 0.2);
      color: var(--text-primary);
      border: 1px solid rgba(138, 43, 226, 0.5);
      border-radius: 8px;
      padding: 0.6rem 1.2rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition-normal);
      
      &:hover {
        background: rgba(138, 43, 226, 0.3);
        transform: translateY(-2px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
  
  .info-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      
      h2 {
        color: var(--text-primary);
        font-size: 1.2rem;
        font-weight: 600;
      }
      
      .edit-btn {
        background: transparent;
        color: var(--primary-light);
        border: 1px solid var(--primary-light);
        border-radius: 6px;
        padding: 0.4rem 1rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: var(--transition-normal);
        
        &:hover {
          background: rgba(138, 43, 226, 0.1);
        }
      }
    }
    
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      
      &.editing .form-group input {
        background: rgba(255, 255, 255, 0.08);
        border-color: var(--primary-color);
      }
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      
      label {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }
      
      input {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 0.7rem 1rem;
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.2s ease;
        
        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        &:focus {
          outline: none;
          border-color: var(--primary-light);
          background: rgba(255, 255, 255, 0.08);
        }
      }
    }
    
    .form-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      
      button {
        padding: 0.7rem 1.5rem;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        
        &.save-btn {
          background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
          color: white;
          border: none;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
        }
        
        &.cancel-btn {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.2);
          
          &:hover {
            background: rgba(255, 255, 255, 0.05);
          }
        }
      }
    }
    
    .section-divider {
      height: 1px;
      width: 100%;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
      margin: 0.5rem 0;
    }
    
    .danger-zone {
      margin-top: 1rem;
      padding: 1.5rem;
      background: rgba(231, 76, 60, 0.08);
      border: 2px solid rgba(231, 76, 60, 0.3);
      border-radius: 8px;
      position: relative;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      
      &::before {
        content: "⚠️";
        position: absolute;
        top: -15px;
        left: 20px;
        font-size: 1.5rem;
        background: var(--background-dark);
        padding: 0 10px;
      }
      
      h2 {
        color: #e74c3c;
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .danger-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      .logout-btn, .delete-btn {
        background: rgba(231, 76, 60, 0.1);
        color: #e74c3c;
        border: 1px solid rgba(231, 76, 60, 0.5);
        border-radius: 6px;
        padding: 0.7rem 1.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition-normal);
        
        &:hover {
          background: rgba(231, 76, 60, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        &:active {
          transform: translateY(0);
          box-shadow: none;
        }
      }

      .delete-btn {
        background: rgba(231, 76, 60, 0.15);
        color: #e74c3c;
        border: 1px solid rgba(231, 76, 60, 0.6);
        font-weight: 600;

        &:hover {
          background: rgba(231, 76, 60, 0.25);
          animation: pulse-warning 2s infinite;
        }
        
        @keyframes pulse-warning {
          0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(231, 76, 60, 0); }
          100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
      }
      
      .delete-account-confirmation {
        margin-top: 1.5rem;
        padding: 1.5rem;
        background: rgba(231, 76, 60, 0.1);
        border: 2px solid rgba(231, 76, 60, 0.5);
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        animation: highlight-danger 1s ease-out;
        
        @keyframes highlight-danger {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        h3 {
          color: #e74c3c;
          font-size: 1.1rem;
          margin-bottom: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
        }
        
        p {
          color: #f8d7da;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          line-height: 1.6;
          background: rgba(231, 76, 60, 0.1);
          padding: 0.8rem;
          border-radius: 6px;
        }
        
        .delete-account-form {
          .form-group {
            margin-bottom: 1.2rem;
            
            label {
              display: block;
              margin-bottom: 0.5rem;
              font-size: 0.9rem;
              color: #e6e6e6;
            }
            
            input {
              width: 100%;
              padding: 0.8rem;
              border-radius: 6px;
              border: 1px solid rgba(255, 255, 255, 0.1);
              background: rgba(0, 0, 0, 0.2);
              color: #e6e6e6;
              transition: var(--transition-normal);
              
              &:focus {
                border-color: rgba(231, 76, 60, 0.5);
                outline: none;
                box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
              }
            }
          }
          
          .form-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            
            .confirm-delete-btn {
              background: #e74c3c;
              color: white;
              border: none;
              border-radius: 6px;
              padding: 0.8rem 1.5rem;
              font-weight: 600;
              cursor: pointer;
              transition: var(--transition-normal);
              position: relative;
              overflow: hidden;
              
              &::before {
                content: "";
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: 0.6s;
              }
              
              &:hover {
                background: #c0392b;
                box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
                
                &::before {
                  left: 100%;
                }
              }
            }
            
            .cancel-btn {
              background: rgba(0, 0, 0, 0.2);
              color: #e6e6e6;
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 6px;
              padding: 0.8rem 1.5rem;
              font-weight: 500;
              cursor: pointer;
              transition: var(--transition-normal);
              
              &:hover {
                background: rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
              }
              
              &:active {
                transform: translateY(0);
              }
            }
          }
        }
      }
    }
  }
  
  /* Responsiveness */
  @media (max-width: 768px) {
    padding: 1rem;
    
    .profile-content {
      padding: 1.5rem;
      gap: 1.5rem;
    }
    
    .avatar-section .avatar-container {
      width: 120px;
      height: 120px;
    }
    
    .danger-zone {
      .danger-actions {
        flex-direction: column;
        gap: 0.8rem;
        
        button {
          width: 100%;
        }
      }
      
      .delete-account-confirmation {
        padding: 1rem;
        
        h3 {
          font-size: 1.1rem;
        }
        
        p {
          font-size: 0.9rem;
          padding: 0.6rem;
        }
        
        .form-group input {
          padding: 0.7rem;
          font-size: 1rem;
        }
        
        .form-buttons {
          flex-direction: column;
          gap: 1rem;
          
          button {
            width: 100%;
            padding: 0.9rem;
            font-size: 1rem;
          }
          
          .confirm-delete-btn {
            order: 2;
          }
          
          .cancel-btn {
            order: 1;
          }
        }
      }
    }
  }
`;
