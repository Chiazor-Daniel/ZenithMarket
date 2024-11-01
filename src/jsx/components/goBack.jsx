import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'; // Importing icons from react-icons

function GoBackArrow() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate back
  };

  const goForward = () => {
    navigate(1); // Navigate forward
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'flex-end', paddingRight: '50px' }}>
      <button onClick={goBack} style={buttonStyle}>
        <FiArrowLeft style={iconStyle} />
        Go Back
      </button>
      {/* <button onClick={goForward} style={buttonStyle}>
        Go Forward
        <FiArrowRight style={iconStyle} />
      </button> */}
    </div>
  );
}

// Styles for button and icon
const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
  margin: '5px',
  cursor: 'pointer',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
};

const iconStyle = {
  fontSize: '20px',
  marginRight: '5px',
};

export default GoBackArrow;
