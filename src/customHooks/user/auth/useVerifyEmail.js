import { useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../../../api';

const useEmailVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    let token = searchParams.get('token');

    if (!token) {
        const url = location.pathname + location.search; // Get the full URL including path and search params
        token = url.split('?')[1]; // Split the URL by "?" and take the second part
    }

    const [loading, setLoading] = useState(true);

    const handleVerifyEmail = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/verify-and-reset/verify-email/?email_token=${token}`);
            if (response.data.status === "success") {
                showSuccessModal();
            } else {
                showFailureModal();
            }
        } catch (error) {
            console.error("Error verifying email:", error);
            showFailureModal();
        }
    };

    const showSuccessModal = () => {
        setTimeout(() => {
            swal({
                title: "Email Verified",
                text: "Email verified successfully.",
                icon: "success",
                button: false,
            });

            setTimeout(() => {
                swal.close(); // Close the modal
                navigate("/");
            }, 2000);
        }, 4000);
    };

    const showFailureModal = () => {
        setLoading(false);
        swal({
            title: "Verification Failed",
            text: "Email verification failed. Please try again.",
            icon: "error",
            buttons: ["Retry", "Cancel"],
        }).then((value) => {
            if (value) {
                handleRetry();
            } else {
                navigate("/");
            }
        });
    };

    const handleRetry = () => {
        setLoading(true);
        handleVerifyEmail();
    };

    useEffect(() => {
        if (token) {
            handleVerifyEmail();
        } else {
            console.error("Token not found in URL parameters");
            navigate("/error");
        }
    }, [token, navigate]);

    return { loading };
};

export default useEmailVerification;
