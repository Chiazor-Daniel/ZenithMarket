import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import bg6 from '../../assets/images/background/bg6.jpg';
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import useSignUp from "../../customHooks/user/auth/useSignup";
import useGetCountries from "../../customHooks/user/auth/useGetCountries";

function Register(props) {
    const navigate = useNavigate();
    const { signUp, load, errors } = useSignUp();
    const countries = useGetCountries();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState(''); // Format: YYYY-MM-DD
    const [country, setCountry] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState('');
    const [terms, setTerms] = useState(false);

    const handleSignUp = (e) => {
        e.preventDefault();
        signUp(email, firstName, lastName, dob, country, phoneNumber, address, password, navigate, props);
    };

    return (
        <>
            <div className="page-wraper">
                <ToastContainer />
                <div className="browse-job login-style3">
                    <div className="bg-img-fix overflow-hidden" style={{ background: '#fff url(' + bg6 + ')', height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div className="col-6 bg-white rounded">
                            <div className="col-12" style={{backgroundColor: '#131722'}}>
                                <div className="card-body">
                                    <nav className="nav nav-tabs border-bottom-0">
                                        <div className="tab-content w-100" id="nav-tabContent">
                                            <div className="tab-pane active show fade">
                                                <form className="dz-form py-2" onSubmit={handleSignUp}>
                                                    <h3 className="form-title">Sign Up</h3>
                                                    <div className="dz-separator-outer m-b5">
                                                        <div className="dz-separator bg-primary style-liner"></div>
                                                    </div>
                                                    <p>Enter your personal details below: </p>
                                                    <div className="form-group mt-3">
                                                        <input value={firstName} style={{background: 'transparent', border: '1px solid rgba(243, 243, 243, 0.04)'}} onChange={(e) => setFirstName(e.target.value)} className="form-control" placeholder="First Name" type="text" />
                                                    </div>
                                                    <div className="form-group mt-3">
                                                        <input value={lastName} style={{background: 'transparent', border: '1px solid rgba(243, 243, 243, 0.04)'}} onChange={(e) => setLastName(e.target.value)} className="form-control" placeholder="Last Name" type="text" />
                                                    </div>
                                                    <div className="form-group mt-3">
                                                        <input value={email} style={{background: 'transparent', border: '1px solid rgba(243, 243, 243, 0.04)'}} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email Address" type="text" />
                                                        {errors.email && <div className="text-danger fs-12">{errors.email}</div>}
                                                    </div>
                                                    <div className="form-group mt-3">
                                                        <input value={dob} style={{background: 'transparent', border: '1px solid rgba(243, 243, 243, 0.04)'}} onChange={(e) => setDob(e.target.value)} className="form-control" placeholder="Date of Birth" type="date" />
                                                    </div>
                                                    <div className="form-group mt-3">
                                                        <input value={address} style={{background: 'transparent', border: '1px solid rgba(243, 243, 243, 0.04)'}} onChange={(e) => setAddress(e.target.value)} className="form-control" placeholder="Address" type="text" />
                                                    </div>
                                                    <div className="form-group mt-3">
                                                        <Form.Select  aria-label="" defaultValue={country} onChange={(e) => setCountry(e.target.value)}>
                                                           {
                                                            countries && countries?.map((c)=> <option value={c?.name?.common}>{c?.name?.common}</option>)
                                                           }
                                                        </Form.Select>
                                                    </div>
                                                    <div className="form-group mt-3">
                                                        <input value={phoneNumber} style={{background: 'transparent', border: '1px solid rgba(243, 243, 243, 0.04)'}} onChange={(e) => setPhoneNumber(e.target.value)} className="form-control" placeholder="Phone Number" type="text" />
                                                    </div>
                                                    <div className="form-group mt-3">
                                                        <input value={password} style={{background: 'transparent', border: '1px solid rgba(243, 243, 243, 0.04)'}} onChange={(e) => setPassword(e.target.value)} className="form-control" placeholder="Password" type="password" />
                                                        {errors.password && <div className="text-danger fs-12">{errors.password}</div>}
                                                    </div>
                                                    <div className="mb-3 mt-3">
                                                        <span className="form-check float-start me-2">
                                                            <input style={{background: 'transparent', border: '1px solid rgba(243, 243, 243, 0.04)'}} type="checkbox" className="form-check-input mt-0" id="check2" name="example1" />
                                                            <label className="form-check-label d-unset" htmlFor="check2">I agree to the</label>
                                                        </span>
                                                        <label><Link to={"#"}>Terms of Service </Link>&amp; <Link to={"#"}>Privacy Policy</Link></label>
                                                    </div>
                                                    <div className="form-group clearfix text-left">
                                                        <NavLink to="/" className="btn btn-primary outline gray" type="button">Back</NavLink >
                                                        <button type="submit" className="btn btn-primary float-end">{
                                                            load ? (
                                                                <Spinner animation="border" role="status" size="sm">
                                                                    <span className="visually-hidden">Loading...</span>
                                                                </Spinner>
                                                            ) : "Submit"
                                                        }</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
