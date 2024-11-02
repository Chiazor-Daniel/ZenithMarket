import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Tooltip } from "react-bootstrap";
import { BASE_URL } from "../../../api";
import { updateAutoTrade } from "../../../redux-contexts/redux/features/auth/authSlice";

const ToggleTrade = () => {
    const { userInfo, userToken } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const toggleStyles = {
        container: {
            alignItems: "center",
            gap: "10px",
            display: "flex",
            justifyContent: "flex-end"
        },
        switchContainer: {
            position: 'relative',
            display: 'inline-block',
            width: '50px',
            height: '24px',
            cursor: loading ? 'wait' : 'pointer'
        },
        input: {
            opacity: 0,
            width: 0,
            height: 0
        },
        slider: {
            position: 'absolute',
            cursor: loading ? 'wait' : 'pointer',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: userInfo.can_auto_trade ? '#2196F3' : '#ccc',
            transition: 'all 0.4s ease',
            borderRadius: '24px',
            border: '1px solid ' + (userInfo.can_auto_trade ? '#1976D2' : '#bbb'),
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        knob: {
            position: 'absolute',
            content: '""',
            height: '20px',
            width: '20px',
            left: '2px',
            bottom: '1px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            transition: '0.4s',
            transform: userInfo.can_auto_trade ? 'translateX(25px)' : 'translateX(0)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
        spinnerStyle: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '16px',
            height: '16px'
        }
    };

    const handleToggleAutoTrade = () => {
        if (loading) return;
        
        Swal.fire({
            title: userInfo.can_auto_trade ? "Deactivate Auto Trader?" : "Activate Auto Trader?",
            text: userInfo.can_auto_trade ? "Are you sure you want to deactivate auto trader?" : "Are you sure you want to activate auto trader?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Yes",
            background: '#131722',
            cancelButtonText: "No",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                setLoading(true);
                fetchAutoTrader();
            }
        });
    };

    const fetchAutoTrader = () => {
        axios.get(`${BASE_URL}/user/trader/auto-trade/`, {
            headers: { "x-token": userToken }
        })
        .then((response) => {
            if (response.data.status === "success") {
                const userInfoFromStorage = JSON.parse(sessionStorage.getItem("userInfo"));
                const newCanAutoTrade = !userInfoFromStorage.can_auto_trade;
                dispatch(updateAutoTrade(newCanAutoTrade));
                toast.success(`🤖 Auto trader ${newCanAutoTrade ? "activated" : "deactivated"} successfully!`, 
                    { autoClose: 1000 });
                Swal.fire({
                    icon: 'success',
                    background: '#131722',
                    title: 'Success',
                    text: `Auto trader ${newCanAutoTrade ? "activated" : "deactivated"} successfully!`
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    background: '#131722',
                    text: 'Please try again later.'
                });
            }
        })
        .catch((err) => {
            console.error(err);
            toast.error("Please try again later.", { autoClose: 1000 });
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div style={toggleStyles.container}>
            <ToastContainer />
            <OverlayTrigger
                trigger={['hover', 'focus']}
                placement="top"
                overlay={
                    <Tooltip id="button-tooltip-2">
                        {!userInfo.can_auto_trade ? "Activate" : "Deactivate"} Auto Trade
                    </Tooltip>
                }
            >
                <div 
                    style={toggleStyles.switchContainer} 
                    onClick={handleToggleAutoTrade}
                >
                    <input
                        type="checkbox"
                        checked={userInfo.can_auto_trade}
                        onChange={() => {}}
                        style={toggleStyles.input}
                    />
                    <div style={toggleStyles.slider}>
                        <div style={toggleStyles.knob}>
                            {loading && (
                                <Spinner 
                                    animation="border" 
                                    size="sm" 
                                    style={toggleStyles.spinnerStyle}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </OverlayTrigger>
        </div>
    );
};

export default ToggleTrade;