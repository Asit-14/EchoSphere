import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.4rem;
  border-radius: 50%;
  background-color: var(--primary-color);
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  transition: var(--transition-fast);
  margin-right: 0.5rem;
  
  &:hover {
    background-color: var(--primary-hover);
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 1.1rem;
    color: var(--text-primary);
  }
`;
