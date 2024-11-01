import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../redux-contexts/redux/features/auth/authSlice';
import { BASE_URL } from '../../../api';
import { toast } from 'react-toastify';

const useSignUp = () => {
    const dispatch = useDispatch();
    const [load, setLoad] = useState(false);
    const [errors, setErrors] = useState({});

    const signUp = (email, firstName, lastName, dob, country, phoneNumber, address, password, navigate, props) => {
        setLoad(true);
        axios.post(`${BASE_URL}/user/auth/register/`, null, {
            params: {
                email,
                first_name: firstName,
                last_name: lastName,
                address,
                country,
                phone_number: phoneNumber,
                date_of_birth: dob,
                password
            },
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.status === 200) {
                if (response.data.message) {
                    toast.success("Registration Successful!", { autoClose: 1000 });
                    axios.get(`${BASE_URL}/user/profile/users/`, {
                        headers: {
                            "x-token": response.data.message
                        }
                    })
                    .then(user => {
                        localStorage.setItem("userInfo", JSON.stringify(user.data));
                        dispatch(loginSuccess({ userInfo: user.data, userToken: response.data.message }));
                        toast.success("Register Success! Proceed to Login", {
                            autoClose: 2000,
                            position: 'top-center',
                            onClose: () => {
                                props.setUserType("user");
                                navigate("/dashboard");
                            }
                        })
                    })
                    .catch(error => {
                        console.error("Error fetching user data:", error);
                    });
                }
            } else {
                console.error("Error signing up:", response.statusText);
                toast.error("Error signing up: " + "User details already exists");
            }
        })
        .catch(error => {
            console.error("Error signing up:", error);
            toast.error("Error signing up: " + "User details already exists");
        })
        .finally(() => {
            setLoad(false);
        });
    };

    return { signUp, load, errors };
};

export default useSignUp;
