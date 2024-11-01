/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSingleUserQuery, useResetUserPasswordMutation } from '../../redux-contexts/redux/services/admin';
import Avatar from 'react-avatar';
import Dropdown from 'react-bootstrap/Dropdown';
import { BiSolidBoltCircle } from "react-icons/bi";
import { Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserForm from './userForm';
import { useEditUseretailsMutation } from '../../redux-contexts/redux/services/admin';
import FilteringTable from '../../jsx/components/table/FilteringTable/FilteringTable';
import Swal from 'sweetalert2';
import { useLoginUserMutation } from '../../redux-contexts/redux/services/admin';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { BASE_URL } from '../../api';
import { loginSuccess } from '../../redux-contexts/redux/features/auth/authSlice';
import { useGetAllTradesQuery } from '../../redux-contexts/redux/services/trades'
import { Tab, Nav } from 'react-bootstrap';
import { useCreateCustomProfitMutation } from '../../redux-contexts/redux/services/admin';
import FutureTable from '../../jsx/components/Trading/futuretable';
import { FaLongArrowAltRight } from "react-icons/fa";
import { useViewUserDocumentQuery } from '../../redux-contexts/redux/services/admin';
import { useGetUserDocumentsQuery } from '../../redux-contexts/redux/services/admin';
import { useVerifyStatusMutation } from '../../redux-contexts/redux/services/admin';
import { FaCircleCheck } from "react-icons/fa6";

import { Modal } from 'react-bootstrap';
import { useUpdateAccountTypeMutation } from '../../redux-contexts/redux/services/admin';
const UserDetails = ({ setUserType, setAsAdmin, userType, superAdmin }) => {
    const { id } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [createCustomProfit] = useCreateCustomProfitMutation()
    const [updateAccountType] = useUpdateAccountTypeMutation()
    const { adminToken, adminInfo } = useSelector(state => state.adminAuth)
    const [editUserDetails, { isLoading: isEditing, error: editingError }] = useEditUseretailsMutation();
    const { data: userData, isLoading, error, refetch } = useGetSingleUserQuery({ id, adminToken });
    const [resetUserPassword, { isLoading: resetLoading, error: reseError }] = useResetUserPasswordMutation()
    const [loginUser, { isLoading: loginLoading, error: loginError }] = useLoginUserMutation()
    const [shouldRefetch, setShouldRefetch] = useState(false);
    const { data: documents, isLoading: documentLoading } = useGetUserDocumentsQuery({ token: adminToken, user_id: id })
    const [fills, setFills] = useState("all")
    const [verifyStatus] = useVerifyStatusMutation()

    const [userAccountType, setUserAccountType] = useState('')
    const handleSubmit = async (formData) => {
        Swal.fire({
            icon: 'info',
            title: 'Update user details',
            text: 'Are you sure you want to update user details?',
            showCancelButton: true,
            confirmButtonText: 'Yes, update',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'info',
                    title: 'Updating user details...',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                try {
                    const editRes = await editUserDetails({ user_id: id, userDetails: formData, token: adminToken });
                    console.log(editRes);
                    if (editRes.data.status === "success") {
                        refetch()
                        Swal.fire({
                            icon: 'success',
                            title: 'User details updated successfully!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed to update user details! No changes were made',
                        text: 'Try again',
                        showConfirmButton: true
                    });
                }
            }
        });
    };
    const userResetPassword = async () => {
        Swal.fire({
            icon: 'info',
            title: 'Reset user password',
            text: 'Are you sure you want to reset this user password?',
            showCancelButton: true,
            confirmButtonText: 'Yes, reset',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'info',
                    title: 'Resetting...',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                try {
                    const resetRes = await resetUserPassword({ user_id: id, token: adminToken });
                    console.log(resetRes)
                    if (resetRes.data.status === "success") {
                        refetch()
                        Swal.fire({
                            icon: 'success',
                            title: 'Password reset success!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed to reset!',
                            text: 'Try again',
                            showConfirmButton: true
                        });
                    }
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed to reset!',
                        text: 'Try again',
                        showConfirmButton: true
                    });
                }
            }
        });
    };

    const reUser = () => {
        refetch();
        setShouldRefetch(true); // Set state to trigger re-render
    };

    const handleLoginUser = async () => {
        try {
            Swal.fire({
                title: 'Logging In',
                html: '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>',
                allowOutsideClick: false,
                showConfirmButton: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });

            const loginRes = await loginUser({ user_id: id, token: adminToken });
            console.log(loginRes);
            console.log("user token", loginRes?.data["access-token"]);

            if (loginRes.data.status === 'success') {
                const userToken = loginRes?.data["access-token"];
                const userInfo = await axios.get(`${BASE_URL}/user/profile/users/`, {
                    headers: {
                        "x-token": userToken
                    }
                });

                sessionStorage.setItem("userToken", userToken); // Save user token in sessionStorage
                sessionStorage.setItem("userInfo", JSON.stringify(userInfo.data)); // Save user info in sessionStorage
                dispatch(loginSuccess({ userInfo: userInfo.data, userToken: userToken }))
                localStorage.setItem("user", "user")


                Swal.fire({
                    icon: "success",
                    title: "Login user success",
                    text: "logged into user account successfully",
                    showConfirmButton: false,
                });

                toast.success("Login successful!", {
                    autoClose: 1000,
                    position: 'top-center',
                    onClose: () => {
                        navigate("/dashboard");
                        console.log("hey", userInfo.data)
                        setUserType("user");
                        setAsAdmin(true)
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Please check your credentials and try again.'
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while logging in. Please try again later.'
            });
        }
    };

    useEffect(() => {
        if (shouldRefetch) {
            setShouldRefetch(false);
        }
    }, [shouldRefetch]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const user = userData[0]?.user;

    const userDetails = [
        { label: 'First Name', value: user.first_name },
        { label: 'Last Name', value: user.last_name },
        { label: 'Email', value: user.email },
        { label: 'Phone Number', value: user.phone_number },
        { label: 'Can Auto Trade', value: user.can_auto_trade ? 'Yes' : 'No' },
        { label: 'Is Active', value: user.is_active ? 'Yes' : 'No' },
        { label: 'User Type', value: user.user_type },
        { label: 'Address', value: user.address },
        { label: 'Country', value: user.country },
        { label: 'Date of Birth', value: user.date_of_birth },
        { label: 'Auto Trade Count', value: user.auto_trade_count },
        { label: 'Verified', value: user.verified ? 'Yes' : 'No' },
        { label: 'Assigned To', value: user.assigned_to },
        { label: 'Created At', value: user.created_at },
    ];

    const transactionDataAvailable = userData[2]?.transaction_activities;

    const handleStatus = async (stats) => {
        Swal.fire({
            title: `Update Status to ${stats}`,
            icon: 'question',
            showCancelButton: true,
            background: '#131722',
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await verifyStatus({
                    token: adminToken,
                    user_id: id,
                    status: stats
                })
                console.log(res)
                if (res?.data.status === 'success') {
                    refetch()
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated Succefully'
                    })
                }
            }
        })
    }

    const DocumentDetails = ({ data }) => {
        const [show, setShow] = useState(false);
        const [fileId, setFileId] = useState(null);
        const [myDoc, setMyDoc] = useState(null);
        const [docLoading, setDocLoading] = useState(false);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        function base64ToArrayBuffer(base64) {
            var binaryString = window.atob(base64);
            var len = binaryString.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }

        function arrayBufferToBlob(buffer, type) {
            return new Blob([buffer], { type: type });
        }

        function createObjectURL(blob) {
            return URL.createObjectURL(blob);
        }

        const viewDocument = async () => {
            setFileId(data.id);
            setDocLoading(true);
            try {
                const res = await axios.get(
                    `https://recover.finnetexh.tech/admin/user/view-verification-document/2/?file_id=${data.id}`,
                    {
                        headers: {
                            "x-token": adminToken
                        },
                        responseType: 'blob'
                    }
                );
                console.log(res.data)
                const blob = res.data; // Blob received directly
                const url = URL.createObjectURL(blob); // Creat

                setMyDoc(url);
            } catch (err) {
                console.log(err);
            }
            setDocLoading(false);
            handleShow();
        };

        return (
            <>
                <div style={{ padding: '20px', backgroundColor: 'rgba(243, 243, 243, 0.04)', margin: '10px', borderRadius: '5px' }}>
                    <div>
                        <strong>Front Document Path:</strong> {data.front_document_path}
                    </div>
                    <div>
                        <strong>Back Document Path:</strong> {data.back_document_path || 'Not Available'}
                    </div>
                    <div>
                        <strong>Created At:</strong> {new Date(data.created_at).toLocaleString()}
                    </div>
                    <Button className='mt-3' onClick={viewDocument}>
                        View Document
                    </Button>
                </div>

                <Modal show={show} onHide={handleClose} centered size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>Document Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            docLoading ? (
                                <p>Loading Document</p>
                            ) : (
                                myDoc ? (
                                    <img src={myDoc} alt="Document" style={{ width: '100%', height: '500px' }} />
                                ) : <p>Not Found</p>
                            )
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
    console.log(userData[0].user.id_verified)
    return (
        <>
            <ToastContainer />
            <div className=''>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h1>User Details</h1>
                </div>
                <div className='row' style={{ gap: "50px", display: "flex", justifyContent: "center" }}>
                    <div className='card col-5' style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", fontSize: "1.3rem", backgroundColor: 'rgba(243, 243, 243, 0.04)' }}>
                        <Dropdown style={{ position: "absolute", right: 20 }}>
                            <Dropdown.Toggle style={{ backgroundColor: "transparent", border: "none", fontSize: "1.5rem", color: "#6c757d", padding: "0" }}>
                                <BiSolidBoltCircle />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">
                                    <button className='btn' style={{ backgroundColor: "red", color: "white" }}>Delete User</button>
                                </Dropdown.Item>
                                {/* Add more dropdown items if needed */}
                            </Dropdown.Menu>
                        </Dropdown>
                        <div className="d-flex align-items-center mb-3" style={{ position: "relative", flexDirection: 'column' }}>
                            <Avatar name={`${user.first_name} ${user.last_name}`} size="150" round />
                            <Dropdown
                                style={{ position: "absolute", top: "0px", right: "0px" }}
                            >
                                <Dropdown.Toggle style={{ backgroundColor: "transparent", border: "none", fontSize: "1.5rem", color: "#6c757d", padding: "0" }}>
                                    <FaCircleCheck color={userData[0].user.id_verified === "verified" ? 'green' : "gray"} size={35} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="verifying" onClick={() => handleStatus('verifying')}>Verifying</Dropdown.Item>
                                    <Dropdown.Item eventKey="verified" onClick={() => handleStatus('verified')}>Verified</Dropdown.Item>
                                    <Dropdown.Item eventKey="unverified" onClick={() => handleStatus('unverified')}>Unverified</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <div style={{ position: "relative", width: "20px", height: "20px" }}>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                                <p>User Account Type: <span style={{ fontWeight: 'bold', fontSize: '1rem', textTransform: 'uppercase' }}>{userData[3]?.accounts[0].account_type}</span> <FaLongArrowAltRight style={{ margin: 'auto' }} /></p>
                                <div style={{ display: 'grid', alignItems: 'center', gap: '10px', }}>
                                    <Form.Select size='sm' onChange={(e) => setUserAccountType(e.target.value)}>
                                        <option value='basic'>BASIC</option>
                                        <option value='premium'>PREMIUM</option>
                                        <option value='gold'>GOLD</option>
                                        <option value='platinum'>PLATINUM</option>
                                    </Form.Select>
                                    <Button onClick={() => {
                                        Swal.fire({
                                            icon: "info",
                                            title: 'Update user account type',
                                            text: `Update to ${userAccountType}`,
                                            showCancelButton: true,
                                            confirmButtonText: "Yes",
                                            cancelButtonText: "No",
                                        }).then(async (result) => {
                                            if (result.isConfirmed) {
                                                try {
                                                    const res = await updateAccountType({
                                                        user_id: parseInt(id),
                                                        admin_id: adminInfo.id,
                                                        token: adminToken,
                                                        account_types: userAccountType
                                                    });
                                                    console.log(res);
                                                    if (res.data.status === 'success') {
                                                        refetch()
                                                        Swal.fire({
                                                            icon: 'success',
                                                            title: 'Account type updated successfully!',
                                                            text: `User account type has been updated to ${userAccountType}.`,
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.error(error);
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Update failed',
                                                        text: 'There was an error updating the account type. Please try again later.',
                                                    });
                                                }
                                            }
                                        });
                                    }}>Update</Button>

                                </div>

                            </div>
                        </div>
                        {userDetails.map((detail, index) => (
                            <div key={index} className='row' style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", width: "100%" }}>
                                <p style={{ width: "50%" }}>{detail.label}:</p>
                                <p style={{ width: "50%" }}>{detail.value}</p>
                            </div>
                        ))}
                        <div className='row' style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button className='btn btn-primary' onClick={handleLoginUser}>
                                Login User Account
                            </button>
                        </div>
                    </div>
                    <div className='col-5'>
                        <div className='' style={{ padding: "20px" }}>
                            <h1>Edit User Details</h1>
                            <UserForm user={user} onSubmit={handleSubmit} userResetPassword={userResetPassword} />
                        </div>
                        <div className='card' style={{ maxHeight: "400px", padding: '20px', backgroundColor: 'rgba(243, 243, 243, 0.04)' }}>
                            <h3>User Account</h3>
                            <p style={{ fontSize: '2rem' }}>Main Balance : $<span style={{ fontWeight: 'bold' }}>{userData[3]?.accounts[0].main_balance}</span></p>
                            <p style={{ fontSize: '1.5rem' }}>Referral Balance : $<span style={{ fontWeight: 'bold' }}>{userData[3]?.accounts[0].referral_balance}</span></p>
                            <p style={{ fontSize: '1.5rem' }}>Bonus Balance : $<span style={{ fontWeight: 'bold' }}>{userData[3]?.accounts[0].bonus_balance}</span></p>

                        </div>
                    </div>
                </div>
                <div>
                    <h1 style={{ marginLeft: '50px' }}>User Documents</h1>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        paddingLeft: '50px',
                        alignItems: 'center',
                        backgroundColor: ''
                    }}>
                        {
                            documents?.message.map((doc, index) => <DocumentDetails key={index} data={doc} />)
                        }
                    </div>

                </div>
                <div style={{ padding: '20px' }}>
                    {userData[2]?.transaction_activities && (
                        <FilteringTable user="admin" data={userData[2].transaction_activities} userId={id} refetchUser={reUser} superAdmin={superAdmin} />
                    )}
                    <div className="card" style={{ padding: "20px", backgroundColor: 'rgba(243, 243, 243, 0.04)' }}>
                        <h4>User trading activities</h4>
                        <Tab.Container defaultActiveKey="All">

                            <div className="card-header border-0">
                                <Nav as="ul" className="order  nav-tabs" id="pills-tab" role="tablist">
                                    <Nav.Item as="li" className=" my-1" role="presentation">
                                        <Nav.Link as="button" eventKey="All" type="button" onClick={() => setFills("all")}>All Trade</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li" className=" my-1" role="presentation">
                                        <Nav.Link as="button" eventKey="Spot" type="button" onClick={() => setFills("open")}>Opened</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li" className=" my-1" role="presentation">
                                        <Nav.Link as="button" className="me-0" eventKey="Listing" type="button" onClick={() => setFills("close")}>Closed</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </div>
                            <div className="card-body pt-0">
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>

                                </div>
                                <FutureTable tradesData={userData[1]['trading activities']} isLoading={isLoading} refetchData={refetch} fills={'all'} userToken={adminToken} userType={userType} userId={parseInt(id)} />
                            </div>
                        </Tab.Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDetails;
