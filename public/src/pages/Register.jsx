import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import SocialLogin from "../components/SocialLogin";
// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
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
          
          <div className="form-steps">
            <div className="step active">1</div>
            <div className="step-line"></div>
            <div className="step">2</div>
            <div className="step-line"></div>
            <div className="step">3</div>
          </div>
          <h3 className="form-title">Create your account</h3>
          
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
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              name="email"
              onChange={(e) => handleChange(e)}
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-check-circle"></i>
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          
          <div className="terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></label>
          </div>
          
          <button type="submit">Create Account</button>
          
          <SocialLogin />
          
          <span className="login-link">
            Already have an account? <Link to="/login">Log In</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--background-medium) 100%);
  position: relative;
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
  
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    
    h1 {
      color: var(--text-primary);
      text-transform: uppercase;
      font-weight: 700;
      font-size: 2.5rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.02); }
      100% { transform: scale(1); }
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 2.2rem;
      }
    }
    
    @media (max-width: 480px) {
      margin-bottom: 0.8rem;
      h1 {
        font-size: 2rem;
      }
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    background-color: rgba(30, 30, 46, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.5rem;
    width: 100%;
    max-width: 430px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: var(--box-shadow);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
    }
    
    /* Custom scrollbar */
    &::-webkit-scrollbar {
      width: 5px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbar);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    
    @media (max-width: 768px) {
      width: 95%;
      padding: 1.3rem;
      max-height: 80vh;
      gap: 0.7rem;
    }
    
    @media (max-width: 480px) {
      width: 92%;
      padding: 1.1rem;
      border-radius: 12px;
      gap: 0.6rem;
      max-height: 75vh;
    }
  }
  
  .form-steps {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.8rem;
    
    .step {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--text-tertiary);
      font-weight: bold;
      transition: all 0.3s;
      font-size: 0.9rem;
      
      &.active {
        background-color: var(--primary-color);
        color: white;
        box-shadow: 0 0 0 2px rgba(154, 134, 243, 0.3);
      }
    }
    
    .step-line {
      height: 2px;
      width: 40px;
      background-color: rgba(255, 255, 255, 0.1);
      
      @media (max-width: 480px) {
        width: 25px;
      }
    }
    
    @media (max-width: 480px) {
      margin-bottom: 0.6rem;
      
      .step {
        width: 22px;
        height: 22px;
        font-size: 0.8rem;
      }
    }
  }
  
  .form-title {
    text-align: center;
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: 0.7rem;
    font-size: 1.1rem;
    
    @media (max-width: 480px) {
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }
  }
  
  .form-group {
    position: relative;
    margin-bottom: 0.1rem;
    
    label {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-tertiary);
      font-size: 0.9rem;
    }
    
    input {
      background-color: rgba(0, 0, 0, 0.2);
      padding: 0.85rem 0.85rem 0.85rem 2.2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: var(--text-primary);
      width: 100%;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }
      
      &:focus {
        border: 1px solid var(--primary-color);
        box-shadow: 0 0 0 2px rgba(154, 134, 243, 0.2);
        outline: none;
      }
    }
    
    @media (max-width: 480px) {
      input {
        padding: 0.75rem 0.75rem 0.75rem 2rem;
        font-size: 0.9rem;
      }
      
      label {
        font-size: 0.85rem;
      }
    }
  }
  
  .terms {
    display: flex;
    align-items: flex-start;
    font-size: 0.8rem;
    margin: 0.3rem 0 0.7rem;
    
    input[type="checkbox"] {
      margin-right: 6px;
      margin-top: 2px;
      accent-color: var(--primary-color);
      width: auto;
    }
    
    label {
      color: var(--text-tertiary);
      line-height: 1.3;
      
      a {
        color: var(--primary-color);
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
      margin: 0.2rem 0 0.6rem;
      
      input[type="checkbox"] {
        margin-top: 1px;
      }
    }
  }
  
  .divider {
    display: flex;
    align-items: center;
    margin: 0.7rem 0;
    
    &:before, &:after {
      content: "";
      flex-grow: 1;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    span {
      padding: 0 0.8rem;
      color: var(--text-tertiary);
      font-size: 0.8rem;
      margin: 0;
    }
    
    @media (max-width: 480px) {
      margin: 0.5rem 0;
      
      span {
        font-size: 0.75rem;
        padding: 0 0.6rem;
      }
    }
  }
  
  .social-login {
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    
    .social-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
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
    
    @media (max-width: 480px) {
      gap: 0.6rem;
      
      .social-btn {
        width: 32px;
        height: 32px;
        font-size: 1rem;
      }
    }
  }
  
  button[type="submit"] {
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 0.85rem 1.8rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;
    font-size: 0.95rem;
    text-transform: uppercase;
    transition: all 0.3s ease;
    letter-spacing: 1px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 7px 14px rgba(78, 14, 255, 0.2);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    @media (max-width: 480px) {
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
      letter-spacing: 0.8px;
    }
  }
  
  .login-link {
    color: var(--text-secondary);
    text-align: center;
    margin-top: 1rem;
    font-size: 0.85rem;
    
    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s ease;
      margin-left: 0.2rem;
      
      &:hover {
        color: var(--secondary-color);
        text-decoration: underline;
      }
    }
    
    @media (max-width: 480px) {
      margin-top: 0.8rem;
      font-size: 0.8rem;
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
    
    form {
      gap: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .brand {
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .brand h1 {
      font-size: 1.8rem;
    }
    
    form {
      padding: 1.5rem;
      gap: 0.8rem;
    }
    
    .form-steps {
      .step {
        width: 25px;
        height: 25px;
        font-size: 0.9rem;
      }
    }
  }
`;
