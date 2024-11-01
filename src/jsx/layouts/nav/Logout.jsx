/* eslint-disable */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux-contexts/redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../../redux-contexts/redux/features/auth/admin-authSlice';

function LogoutPage(props) {
  const { userToken } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    if(props.userType == "user"){
      dispatch(logout());
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('token');
      navigate("/")
    }
    if(props.userType == "admin"){
      dispatch(adminLogout());
      sessionStorage.removeItem('adminInfo');
      sessionStorage.removeItem('adminToken');
      navigate("/")
    }
  };

  // useEffect(() => {
  //   if (!userToken) {
  //     navigate("/");
  //   }
  // }, [userToken, navigate]);

  return (
    <>
      <button className="dropdown-item ai-icon ms-1" onClick={handleLogout}>
        <svg xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span className="ms-2">Logout</span>
      </button>
    </>
  );
}

export default LogoutPage;