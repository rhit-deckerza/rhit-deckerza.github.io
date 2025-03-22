import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Resume: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new home page
    navigate('/');
  }, [navigate]);
  
  return null; // No UI rendering needed as this is just a redirect
};

export default Resume;