import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure, loginSuccess } from '../../../redux-contexts/redux/features/auth/authSlice';
import { BASE_URL } from '../../../api';
import { toast } from 'react-toastify';


const useAuth = () => {
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);

    const loginUser = (email, password, navigate, props) => {
        setLoad(true);

        const token = sessionStorage.getItem("token");
        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

        if (token && userInfo) {
            dispatch(loginSuccess({ userInfo, userToken: token }));
            toast.success("Logged in successfully!", {
                autoClose: 1000,
                position: 'top-center',
                onClose: () => {
                    navigate("/dashboard");
                    props.setUserType("user");
                }
            });
        } else {
            dispatch(loginStart());

            axios.post(`${BASE_URL}/user/auth/login/`, {
                email,
                password
            }, {
                params: {
                    email,
                    password
                },
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        const accessToken = response.data.access_token;
                        sessionStorage.setItem("token", accessToken);

                        const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000;
                        sessionStorage.setItem("tokenExpiration", expirationTime);

                        axios.get(`${BASE_URL}/user/profile/users/`, {
                            headers: {
                                "x-token": accessToken
                            }
                        })
                            .then(user => {
                                sessionStorage.setItem("userInfo", JSON.stringify(user.data));
                                dispatch(loginSuccess({ userInfo: user.data, userToken: accessToken }));

                                if (user) {
                                    setLoad(false);
                                    toast.success("Login successful!", {
                                        autoClose: 1000,
                                        position: 'top-center',
                                        onClose: () => {
                                            navigate("/dashboard");
                                            props.setUserType("user");
                                            sessionStorage.setItem('userType', 'user')
                                        }
                                    });
                                }
                            })
                            .catch(error => {
                                dispatch(loginFailure(error.message));
                                setLoad(false);
                            });
                    } else {
                        dispatch(loginFailure("Invalid response status"));
                        setLoad(false);
                    }
                })
                .catch(error => {
                    dispatch(loginFailure(error.message));
                    setLoad(false);
                    toast.error("Incorrect email or password");
                });
        }
    };

    return { loginUser, load };
};

export default useAuth;
