import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";
import { getUserFromStorage, saveUserToStorage } from "../utils/helpers";
import SocialLogin from "../components/SocialLogin";
// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (getUserFromStorage()) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const { username, password } = values;
        console.log("Login attempt with username:", username);
        console.log("API URL being used:", loginRoute);
        
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        });
        
        console.log("Login response:", data);
        
        if (data.status === false) {
          console.log("Login failed:", data.msg);
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          console.log("Login successful, saving user to storage");
          saveUserToStorage(data.user);
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An error occurred during login. Please try again.", toastOptions);
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <h1>EchoSphere</h1>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i>
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              name="username"
              onChange={(e) => handleChange(e)}
              min="3"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          </div>
          
          <button type="submit">Log In</button>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          <SocialLogin />
          
          <span className="signup-link">
            Don't have an account? <Link to="/register">Create One</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--background-medium) 100%);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1rem;
  
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
  
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.5rem;
    
    h1 {
      color: var(--text-primary);
      text-transform: uppercase;
      font-weight: 700;
      font-size: 3rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: rgba(30, 30, 46, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 3rem;
    width: 100%;
    max-width: 400px;
    box-shadow: var(--box-shadow);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: transform 0.3s ease;
    margin: 1rem;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    @media (max-width: 768px) {
      max-width: 380px;
      padding: 2.5rem;
    }
    
    @media (max-width: 480px) {
      width: 95%;
      max-width: 100%;
      padding: 2rem 1.5rem;
      margin: 0.5rem;
      border-radius: 12px;
      transform: none;
      
      &:hover {
        transform: none;
      }
    }
  }
  
  .form-group {
    position: relative;
    margin-bottom: 0.5rem;
    
    label {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-tertiary);
      font-size: 1rem;
    }
    
    input {
      background-color: rgba(0, 0, 0, 0.2);
      padding: 1rem 1rem 1rem 2.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: var(--text-primary);
      width: 100%;
      font-size: 1rem;
      transition: all 0.3s ease;
      -webkit-appearance: none; /* Fix iOS styling */
      appearance: none;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      
      &:focus {
        border: 1px solid var(--primary-color);
        box-shadow: 0 0 0 2px rgba(154, 134, 243, 0.2);
        outline: none;
      }
      
      @media screen and (max-width: 480px) {
        padding: 0.9rem 0.9rem 0.9rem 2.5rem;
        font-size: 0.95rem;
      }
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    margin: -0.5rem 0 0.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    @media screen and (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    
    .remember-me {
      display: flex;
      align-items: center;
      
      input[type="checkbox"] {
        margin-right: 6px;
        accent-color: var(--primary-color);
        width: auto;
      }
      
      label {
        color: var(--text-tertiary);
        cursor: pointer;
        position: relative;
        top: auto;
        left: auto;
        transform: none;
      }
    }
    
    .forgot-password {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.2s;
      
      &:hover {
        color: var(--secondary-color);
        text-decoration: underline;
      }
    }
    
    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
  
  .divider {
    display: flex;
    align-items: center;
    margin: 1rem 0;
    
    &:before, &:after {
      content: "";
      flex-grow: 1;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    span {
      padding: 0 1rem;
      color: var(--text-tertiary);
      font-size: 0.85rem;
      margin: 0;
    }
  }
  
  .social-login {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    
    @media screen and (max-width: 480px) {
      gap: 0.8rem;
    }
    
    .social-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      transition: all 0.3s;
      border: none;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-3px);
      }
      
      &:active {
        transform: translateY(-1px);
      }
      
      @media screen and (max-width: 480px) {
        width: 42px;
        height: 42px;
        font-size: 1.1rem;
      }
      
      &.google {
        background-color: #DB4437;
      }
      
      &.facebook {
        background-color: #4267B2;
      }
      
      &.github {
        background-color: #333;
      }
    }
  }
  
  button[type="submit"] {
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;
    font-size: 1rem;
    min-height: 48px;
    
    @media screen and (max-width: 480px) {
      padding: 0.9rem 1.5rem;
      width: 100%;
    }
    border-radius: 8px;
    font-size: 1rem;
    text-transform: uppercase;
    transition: all 0.3s ease;
    margin-top: 0.5rem;
    letter-spacing: 1px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 7px 14px rgba(78, 14, 255, 0.2);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  .signup-link {
    color: var(--text-secondary);
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    
    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease;
      margin-left: 0.3rem;
      
      &:hover {
        color: var(--secondary-color);
        text-decoration: underline;
      }
    }
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .brand h1 {
      font-size: 2rem;
    }
    
    .brand img {
      height: 4rem;
    }
  }
  
  @media (max-width: 480px) {
    .brand {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .brand h1 {
      font-size: 1.8rem;
    }
    
    form {
      padding: 2rem 1.5rem;
    }
  }
`;
