import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure, loginSuccess } from '../../redux-contexts/redux/features/auth/authSlice';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer } from 'react-toastify'; // Add this import if toast is used here
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { BASE_URL } from '../../api';
import SetLogo from '../../setLogo';
import bg6 from '../../assets/images/background/bg6.jpg';
import useAuth from '../../customHooks/auth/useAuth';

function Login(props) {
    const { loginUser, load } = useAuth(); // Use the custom hook
    const navigate = useNavigate();
    const [email, setEmail] = useState('jane@exaple.com');
    let errorsObj = { email: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);
    const [password, setPassword] = useState('default123');
    
    function onLogin(e) {
        e.preventDefault();
        loginUser(email, password, navigate, props);
        let error = false;
        const errorObj = { ...errorsObj };
        if (email === '') {
            errorObj.email = 'Email is Required';
            error = true;
        }
        if (password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }
        setErrors(errorObj);
        if (error) {
            return;
        }
    }

    const [rememberMe, setRememberMe] = useState(true);
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="page-wraper">
            <ToastContainer />
            <div className="browse-job login-style3">
                <div className="bg-img-fix overflow-hidden" style={{ background: '#fff url(' + bg6 + ')', height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div className="row col-lg-6 col-12 rounded">
                        <div className="col-12" >
                            <div className="card-body">
                                <div className="logo-header">
                                    <Link to={"#"} className="logo"><SetLogo /></Link>
                                </div>
                                <div className="nav nav-tabs border-bottom-0" >
                                    <div className="tab-content w-100" id="nav-tabContent">
                                        <div className="tab-pane fade active show" id="nav-personal">
                                            {props.errorMessage && (
                                                <div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
                                                    {props.errorMessage}
                                                </div>
                                            )}
                                            {props.successMessage && (
                                                <div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
                                                    {props.successMessage}
                                                </div>
                                            )}
                                            <form className=" dz-form pb-3" onSubmit={onLogin}>
                                                <h3 className="form-title m-t0">Personal Information</h3>
                                                <div className="dz-separator-outer m-b5">
                                                    <div className="dz-separator bg-primary style-liner"></div>
                                                </div>
                                                <p>Enter your e-mail address and your password. </p>
                                                <div className="form-group mb-3">
                                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter Email Address'/>
                                                    {errors.email && <div className="text-danger fs-12">{errors.email}</div>}
                                                </div>
                                                <div className="form-group mb-3" style={{position: "relative"}}>
                                                    {
                                                        (showPass && password.length > 0) ? (
                                                            <FaEyeSlash style={{position: "absolute", right: 8, top: 10, cursor: "pointer"}} size={30} onClick={()=> setShowPass(false)} />
                                                        ): (
                                                            <IoEyeSharp style={{position: "absolute", right: 8, top: 10, cursor: "pointer"}} size={30} onClick={()=> setShowPass(true)}/>
                                                        )
                                                    }
                                                    <input type={showPass ? "text" : "password"} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password'/>
                                                    {errors.password && <div className="text-danger fs-12">{errors.password}</div>}
                                                </div>
                                                <div className="form-group text-left mb-5">

                                                    <button type="submit" className="btn btn-primary dz-xs-flex m-r5">
                                                        {
                                                            load ? (
                                                                <Spinner animation="border" role="status" size="sm">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </Spinner>
                                                            ) : "login"
                                                        }
                                                    </button>
                                                    <span className="form-check d-inline-block ms-2">
                                                        <input type="checkbox" className="form-check-input" id="check1" name="example1" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                                                        <label className="form-check-label" htmlFor="check1">Remember me</label>
                                                    </span>
                                                    <div className='row' style={{ padding: "10px" }}>
                                                        <Link to="/forgot-password">
                                                            Forgot password ?
                                                        </Link>
                                                        <Link to="/admin/admin-login">
                                                            Admin ?
                                                        </Link>
                                                    </div>
                                                </div>
                                            </form>
                                            <div className="text-center">
                                                <NavLink to="/register" className="btn btn-primary button-md btn-block" >
                                                    Create an account
                                                </NavLink>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
