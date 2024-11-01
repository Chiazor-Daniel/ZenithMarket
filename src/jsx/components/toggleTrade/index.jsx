/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2"; 
import Spinner from 'react-bootstrap/Spinner'; 
import { BASE_URL } from "../../../api";
import { useDispatch } from "react-redux";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Tooltip } from "react-bootstrap";
import { updateAutoTrade } from "../../../redux-contexts/redux/features/auth/authSlice";
const ToggleTrade = ({ autoTrader, handleAutoTrader }) => {
    const { userInfo, userToken } = useSelector(state => state.auth);
    const [autoTrade, setAutoTrade] = useState(userInfo.can_auto_trade);
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false); // State to manage loading indicator

    const handleToggleAutoTrade = () => {
        // Trigger SweetAlert confirmation dialog
        Swal.fire({
            title: userInfo.can_auto_trade ? "Deactivate Auto Trader?" : "Activate Auto Trader?",
            text: userInfo.can_auto_trade ? "Are you sure you want to deactivate auto trader?" : "Are you sure you want to activate auto trader?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Yes",
            background: '#131722',
            cancelButtonText: "No",
            showLoaderOnConfirm: true, // Show loading spinner on confirm button
            preConfirm: () => {
                // Set loading state to true
                setLoading(true);
                // Call fetchAutoTrader after user confirms
                fetchAutoTrader();
            }
        });
    };

    const fetchAutoTrader = () => {
        axios.get(`${BASE_URL}/user/trader/auto-trade/`, {
            headers: {
                "x-token": userToken
            }
        })
            .then((response) => {
                console.log(response);
                if (response.data.status === "success") {
                    const userInfoFromStorage = JSON.parse(sessionStorage.getItem("userInfo"));
                    const newCanAutoTrade = !userInfoFromStorage.can_auto_trade;
                    dispatch(updateAutoTrade(newCanAutoTrade));
                    toast.success("🤖 Auto trader " + (newCanAutoTrade ? "activated" : "deactivated") + " successfully!", { autoClose: 1000 });
                    Swal.fire({
                        icon: 'success',
                        background: '#131722',
                        title: 'Success',
                        text: "Auto trader " + (newCanAutoTrade ? "activated" : "deactivated") + " successfully!"
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        background: '#131722',
                        text: 'Please try again later.',
                    });
                }

            })
            .catch((err) => {
                console.log(err);
                toast.error("Please try again later.", { autoClose: 1000 });
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(()=> console.log(userInfo.can_auto_trade),[])
    

    return (
        <div style={{ alignItems: "center", gap: "10px", display: "flex", justifyContent: "flex-end" }}>
            <ToastContainer />
            <OverlayTrigger
            trigger={['hover', 'focus']}
                placement="top"
                overlay={<Tooltip id="button-tooltip-2">{!userInfo.can_auto_trade ? "Activate " : "Deactivate"} Auto Trade</Tooltip>}
            >
                <div className="switch">
                    <span>
                        <input
                            type="checkbox"
                            id="toggleInput"
                            checked={userInfo.can_auto_trade ? true : false}
                        />
                        <button className="slider" type="button" onClick={handleToggleAutoTrade} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : ""}
                        </button>
                    </span>
                </div>
            </OverlayTrigger>
        </div>
    );
};

export default ToggleTrade;
