import React, { useState, useEffect, useRef, ReactDOM } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import ReactCountryFlag from 'react-country-flag';
import CountryCodeForm from './country';
import { RiseLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';


const WheelOfFortune = () => {
  const [display, setDisplay] = useState('-');
  const [isSpinning, setIsSpinning] = useState(false);
  const [userCountry, setUserCountry] = useState('');
  const wheelRef = useRef(null);
  const startButtonRef = useRef(null);
  const navigate = useNavigate();

  const symbolSegments = {
    1: "$2000",
    2: "$3000",
    3: "$10000",
    4: "$5000",
    5: "$1500",
    6: "$4500",
    7: "$3500",
    8: "2000",
  };
  const fetchUserCountry = async () => {
    try {
      const response = await axios.get('https://ipapi.co/json/');
      setUserCountry(response.data.country_name);
    } catch (error) {
      console.error('Error fetching user country:', error);
    }
  };

  useEffect(() => {
    fetchUserCountry();
  }, []);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setDisplay('-');

    const wheel = wheelRef.current;
    const deg = Math.floor(5000 + Math.random() * 5000);

    wheel.style.transition = 'all 10s ease-out';
    wheel.style.transform = `rotate(${deg}deg)`;
    wheel.classList.add('blur');

    setTimeout(() => {
      wheel.classList.remove('blur');
      setIsSpinning(false);
      wheel.style.transition = 'none';
      const actualDeg = deg % 360;
      wheel.style.transform = `rotate(${actualDeg}deg)`;
      Swal.close();
      handleWin(actualDeg);
    }, 10000);
  };


  const handleWin = (actualDeg) => {
    const zoneSize = 45;
    const winningSymbolNr = Math.ceil(actualDeg / zoneSize);
    const prize = symbolSegments[winningSymbolNr];
    setDisplay(prize);

    Swal.fire({
      title: 'Congratulations!',
      text: `You won ${prize}!`,
      icon: 'success',
      confirmButtonText: 'Claim Prize',
      background: '#2C3E50',
      color: '#ECF0F1',
      iconColor: '#2ECC71',
      customClass: {
        popup: 'custom-popup',
        title: 'custom-title',
        content: 'custom-content',
        confirmButton: 'custom-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        showClaimForm(prize);
      }
    });
  };


  const showClaimForm = (prize) => {
    Swal.fire({
      title: 'Claim Your Prize',
      html: `
        <div class="claim-form">
          <div class="form-row">
            <input id="first_name" class="swal2-input custom-input" placeholder="First Name">
            <input id="last_name" class="swal2-input custom-input" placeholder="Last Name">
          </div>
          <div class="form-row">
            <input id="email" class="swal2-input custom-input" placeholder="Email">
            <input id="phone_number" class="swal2-input custom-input" placeholder="Phone Number">
          </div>
          <div class="form-row">
            <input id="country" class="swal2-input custom-input" placeholder="Country" value="${userCountry}">
          </div>
        </div>
      `,
      focusConfirm: false,
      confirmButtonText: 'Submit',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      background: '#2C3E50',
      color: '#ECF0F1',
      customClass: {
        popup: 'custom-popup',
        title: 'custom-title',
        content: 'custom-content',
        confirmButton: 'custom-button',
        cancelButton: 'custom-button'
      },
      preConfirm: () => {
        return {
          first_name: document.getElementById('first_name').value,
          last_name: document.getElementById('last_name').value,
          email: document.getElementById('email').value,
          phone_number: document.getElementById('phone_number').value,
          country: document.getElementById('country').value,
          bonus_amount: parseFloat(prize.replace('$', '')),
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        submitClaimForm(result.value);
      }
    });
  };



  const submitClaimForm = async (formData) => {
    Swal.fire({
      title: 'Submitting...',
      html: 'Please wait while we process your claim.',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      background: '#2C3E50',
      color: '#ECF0F1',
    });

    try {
      const response = await axios.post(
        `https://finno-api.finnovent.com/general-route/create-new-user-from-ads?first_name=${formData.first_name}&last_name=${formData.last_name}&email=${formData.email}&phone_number=${formData.phone_number}&country=${formData.country}&bonus_amount=${formData.bonus_amount}`,
        null,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-token': 'hi8qX8qLpJmCYQX5eL7Ifz47CpOtxf2EpyxxGh7MItghqs34mo'
          }
        }
      );

      const prizeToken = response?.data?.message;

      if (response.data.status === 'success') {
        document.cookie = `prizeToken=${prizeToken}; path=/; domain=localhost; secure; samesite=lax;`;

        Swal.fire({
          title: 'Success!',
          text: 'Your prize claim has been submitted successfully.',
          icon: 'success',
          background: '#2C3E50',
          color: '#ECF0F1',
          iconColor: '#2ECC71',
          customClass: {
            popup: 'custom-popup',
            title: 'custom-title',
            content: 'custom-content',
            confirmButton: 'custom-button'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(`localhost:5173`);
          }
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage === "Unable to create user") {
        Swal.fire({
          title: 'Already Claimed',
          text: 'It looks like you have already claimed the prize. Proceed to the dashboard to view your rewards.',
          icon: 'info',
          background: '#2C3E50',
          color: '#ECF0F1',
          iconColor: '#F39C12',
          showCancelButton: true,
          confirmButtonText: 'Proceed to Dashboard',
          cancelButtonText: 'Cancel',
          customClass: {
            popup: 'custom-popup',
            title: 'custom-title',
            content: 'custom-content',
            confirmButton: 'custom-button',
            cancelButton: 'custom-button'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/dashboard';
          }
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'There was an error submitting your claim. Please try again.',
          icon: 'error',
          background: '#2C3E50',
          color: '#ECF0F1',
          iconColor: '#E74C3C',
          customClass: {
            popup: 'custom-popup',
            title: 'custom-title',
            content: 'custom-content',
            confirmButton: 'custom-button'
          }
        });
      }
    }
  };


  return (
    <div className="wheel-of-fortune">
      <div id="app">
        <img className="marker" src="marker.png" alt="Marker" />
        <img className="wheel" src="wee.png" alt="Wheel" ref={wheelRef} />
        <img
          className="button"
          src="button.png"
          alt="Spin"
          onClick={spin}
          ref={startButtonRef}
          style={{ pointerEvents: isSpinning ? 'none' : 'auto' }}
        />
      </div>

      <style jsx>{`
  .wheel-of-fortune {
    font-family: Arial, Helvetica, sans-serif;
  }
  #app {
    width: 400px;
    height: 400px;
    margin: 0 auto;
    position: relative;
    transform: scale(1);
  }
  .marker {
    position: absolute;
    width: 60px;
    left: 172px;
    top: -20px;
    z-index: 2;
  }
  .wheel {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .button {
    display: block;
    width: 250px;
    z-index: 999;
    margin: 10px auto;
    cursor: pointer;
  }
  .button:hover {
    opacity: 0.8;
  }
  .blur {
    animation: blur 10s;
  }
  @keyframes blur {
    0% {
      filter: blur(1.5px);
    }
    80% {
      filter: blur(1.5px);
    }
    100% {
      filter: blur(0px);
    }
  }
  .user-country {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
  .user-country span {
    margin-left: 10px;
  }

  /* Media queries for desktop and tablet view */
  @media (min-width: 768px) { /* Tablet and up */
    #app {
      transform: scale(1.4);
    }
  }
  @media (min-width: 1024px) { /* Desktop and up */
    #app {
      transform: scale(1.4);
    }
  }
`}</style>

      <style jsx global>{`
        .custom-popup {
          border-radius: 15px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
        }
        .custom-title {
          font-size: 28px;
          color: #ECF0F1;
        }
        .custom-content {
          font-size: 18px;
          color: #BDC3C7;
        }
        .custom-button {
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
          padding: 12px 24px;
          border-radius: 30px;
          transition: all 0.3s ease;
        }
        .custom-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .custom-input, .custom-textarea {
          background-color: #34495E !important;
          color: #ECF0F1 !important;
          border: 1px solid #7F8C8D !important;
          border-radius: 5px !important;
          margin-bottom: 10px !important;
        }
        .custom-input::placeholder, .custom-textarea::placeholder {
          color: #95A5A6 !important;
        }
      `}</style>
    </div>
  );
};

export default WheelOfFortune;