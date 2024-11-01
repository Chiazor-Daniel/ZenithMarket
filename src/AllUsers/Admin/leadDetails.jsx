/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditLeadMutation, useGetSingleLeadQuery, useViewCommentsQuery } from '../../redux-contexts/redux/services/admin';
import { useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Avatar from 'react-avatar';
import { Dropdown } from 'react-bootstrap';
import { BiSolidBoltCircle } from 'react-icons/bi';
import ToggleSwitch from '../../jsx/components/toggleSwitch';
import { useActivateLeadMutation } from '../../redux-contexts/redux/services/admin';
import { FaComment } from "react-icons/fa";
import AdminTable from '../../jsx/components/table/FilteringTable/AdminTable';
import { useDeleteLeadMutation } from '../../redux-contexts/redux/services/admin';
import { useGetAllAdminsQuery } from '../../redux-contexts/redux/services/admin';
import { useAssignLeadToAdminMutation } from '../../redux-contexts/redux/services/admin';
import { useAddCommentsMutation } from '../../redux-contexts/redux/services/admin';

const ViewLead = ({superAdmin}) => {
    const navigate = useNavigate()
    const { id } = useParams();
    const { adminInfo, adminToken } = useSelector(state => state.adminAuth);
    const { data: allAdmins, isLoading: allAdminLoadin } = useGetAllAdminsQuery(adminToken);
    const { data, isLoading, error, refetch } = useGetSingleLeadQuery({ token: adminToken, lead_id: id, admin_id: adminInfo.id });
    const [editLead, { isLoading: editing, error: editError }] = useEditLeadMutation()
    const [assignLeadToAdmin] = useAssignLeadToAdminMutation()
    const [addComments] = useAddCommentsMutation()
    const [comment, setComment] = useState('');
    const [loadingActivate, setLoadingActivate] = useState(false);
    const [activateLead] = useActivateLeadMutation();
    const [deleteLead] = useDeleteLeadMutation()
    const { data: comments, isLoading: commentsLoading, error: commentsError, refetch: refetchComments } = useViewCommentsQuery({ admin_id: adminInfo.id, lead_id: id, token: adminToken })
    const crmCommentsColumns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id',
            },
            {
                Header: 'Created At',
                accessor: 'created_at',
            },
            {
                Header: 'User ID',
                accessor: 'user_id',
            },
            {
                Header: 'Comment',
                accessor: 'comment',
            },
            {
                Header: 'Actions',
                accessor: '',
                Cell: ({ value }) => (
                    <div style={{ display: "flex", gap: "20px" }}>
                        {/* Add your action buttons here */}
                        <button className='btn btn-primary'> View comment</button>
                        {/* Add more buttons if needed */}
                    </div>
                ),
            },
        ],
        [] // Empty dependency array, assuming you don't need any dynamic changes
    );

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        status: '',
        country: '',
        address: '',
        dateOfBirth: '',
        activated: false,
        createdAt: ''
    });

    useEffect(() => {
        if (!isLoading && data && data.message) {
            const { first_name, last_name, email, phone_number, status, country, address, date_of_birth, activated, created_at } = data?.message;
            setFormData({
                firstName: first_name,
                lastName: last_name,
                email,
                phoneNumber: phone_number,
                status,
                country,
                address,
                dateOfBirth: date_of_birth,
                activated,
                createdAt: created_at
            });
        }
    }, [data, isLoading]);

    const handleEditLead = async () => {
        Swal.fire({
            title: `Confirm edit lead`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, edit it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await editLead({
                        token: adminToken,
                        lead_id: id,
                        admin_id: adminInfo.id,
                        ...formData
                    })
                    if (res.data.status === "success") {
                        refetch()
                        Swal.fire({
                            title: "Lead updated successfully",
                            icon: "success",
                            confirmButtonColor: '#3085d6',
                        })
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: "An error occurred while updating the lead. Please try again later.",
                            icon: "error",
                            confirmButtonColor: '#3085d6',
                        })
                    }
                } catch (error) {
                    console.error("Error editing lead:", error);
                    Swal.fire({
                        title: "Error",
                        text: "An error occurred while updating the lead. Please try again later.",
                        icon: "error",
                        confirmButtonColor: '#3085d6',
                    })
                }
            }
        })
    }

    const handleToggleActivation = async () => {
        setLoadingActivate(true); 
        try {
            const res = await activateLead({ lead_id: id, token: adminToken, admin_id: adminInfo.id });
            console.log(res)
            if (res.data.status === "success") {
                refetch();
                Swal.fire({
                    title: "Lead activated successfully",
                    icon: "success",
                    confirmButtonColor: '#3085d6',
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "An error occurred while activating the lead. Please try again later.",
                    icon: "error",
                    confirmButtonColor: '#3085d6',
                });
            }
        } catch (error) {
            console.error("Error activating lead:", error);
            Swal.fire({
                title: "Error",
                text: "An error occurred while activating the lead. Please try again later.",
                icon: "error",
                confirmButtonColor: '#3085d6',
            });
        } finally {
            setLoadingActivate(false); // Set loading state back to false
        }
    };

    // Destructure state variables
    const { firstName, lastName, email, phoneNumber, status, country, address, dateOfBirth, activated, createdAt } = formData;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleDelete = async () => {
        Swal.fire({
            title: 'Confirm delete lead',
            text: 'Are you sure you want to create this lead?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log({
                    token: adminToken,
                    lead_id: id,
                    admin_id: adminInfo.id
                })
                try {
                    const res = await deleteLead({
                        token: adminToken,
                        lead_id: id,
                        admin_id: adminInfo.id
                    });
                    console.log("this res", res)
                    if (res.data.status === "success") {
                        refetch()
                        Swal.fire({
                            title: 'Lead deleted successfully',
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            onClose: () => {
                                navigate("/admin/admin-dashboard/crm")
                            }
                        });
                    } else {
                        refetch()
                        throw new Error('An error occurred while deleting the lead.');
                    }
                } catch (error) {
                    refetch()
                    Swal.fire({
                        title: 'Error',
                        text: `An error occurred while deleting the lead`,
                        icon: 'error',
                        confirmButtonColor: '#3085d6'
                    });
                }
            }
        });
    };
    const columns_admin = React.useMemo(
        () => [
          {
            Header: 'First Name',
            accessor: 'first_name',
          },
          {
            Header: 'Last Name',
            accessor: 'last_name',
          },
          {
            Header: 'Email',
            accessor: 'email',
          },
          {
            Header: 'Phone Number',
            accessor: 'phone_number',
          },
          {
            Header: 'Can Auto Trade',
            accessor: 'can_auto_trade',
            Cell: ({ value }) => (value ? 'Yes' : 'No'),
          },
          {
            Header: 'Is Active',
            accessor: 'is_active',
            Cell: ({ value }) => (value ? 'Yes' : 'No'),
          },
          {
            Header: "", 
            accessor: 'id',
            Cell: ({ row }) => (
                superAdmin ? (
                    <button
                    className='btn btn-primary'
                    onClick={() => {
                        Swal.fire({
                            icon: "info",
                            title: "Assign lead to admin",
                            text: `Assign lead to ${row.values.first_name + " " + row.values.last_name} `,
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yup, assign it!',
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                try {
                                    const res = await assignLeadToAdmin({
                                        token: adminToken,
                                        lead_id: id,
                                        admin_id: parseInt(row.values.id),
                                        assign_task: "assign"
                                    });
                                    console.log(res);
                                    if(res.data.status === "success"){
                                        Swal.fire({
                                            icon: "success", 
                                            title: `Assigned to ${row.values.first_name} success`
                                        })
                                    }else{
                                        Swal.fire({
                                            icon: "error", 
                                            title: "An error occured", 
                                            text: "An error occured. Please try again"
                                        })
                                    }
                                } catch (error) {
                                    console.error("Error assigning lead to admin:", error);
                                    Swal.fire({
                                        icon: "error", 
                                        title: "An error occured", 
                                        text: "An error occured. Please try again"
                                    })
                                }
                            }
                        })
                    }}
                >
                    Assign Lead to Admin
                </button>
                ) : (
                    <>
                    </>
                )
            ),
          },
        ],
        []
      );
    if (!isLoading && data?.message)
        return (
            <div style={{padding: '20px'}}>
                <h1>Lead Detail</h1>
                {
                    (superAdmin && allAdmins) && (

                        <AdminTable columns={columns_admin} data={allAdmins} />
                    )
                }
                <div className='row'>
                    <div className=' col-12' style={{ padding: "20px", height: "auto" }}>
                        <div className='col-6' style={{ margin: "auto", height: "auto" }}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label><FaComment /> Add a comment</Form.Label>
                                <Form.Control as="textarea" rows={6} style={{ height: "100%",  }} onChange={(e)=>setComment(e.target.value)} value={comment} required/>
                            </Form.Group>
                            <div style={{display: "flex", justifyContent: "flex-end"}}>
                                <Button onClick={()=>{
                                    Swal.fire({
                                        icon: "info", 
                                        title: "Add Comment", 
                                        text: "Click ok to add commment", 
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Yes, add it!',
                                    }).then(async (result)=>{
                                        if(result.isConfirmed){
                                            try{
                                                const res = await addComments({token: adminToken, lead_id: parseInt(id), admin_id: parseInt(adminInfo.id), comment: comment})
                                                console.log({token: adminToken, lead_id: id, admin_id: parseInt(adminInfo.id), comment: comment})
                                                console.log(res)
                                                if(res.data.comment){
                                                    refetchComments()
                                                    Swal.fire({
                                                        icon: "success", 
                                                        confirmButtonColor: '#3085d6',
                                                        title: "comment added"
                                                    })
                                                }
                                            }catch(err){
                                                console.log(err)
                                                Swal.fire({
                                                    icon: "error", 
                                                    title: "An error occured. Try again", 
                                                    confirmButtonColor: '#3085d6',
                                                    
                                                })
                                            }
                                        }
                                    })
                                }}>Add comment</Button>
                            </div>
                        </div>
                    </div>
                    {
                        comments ? (
                            <AdminTable columns={crmCommentsColumns} data={comments} title={"Comments"} />
                        ) : (
                            <div className='d-flex' style={{ alignItems: "center", gap: "20px", justifyContent: "space-between ", padding: "10px" }}>
                                <p>No comments found ...</p>
                            </div>
                        )
                    }
                </div>
                <div className='row' style={{ gap: "50px", display: "flex", justifyContent: "center" }}>
                    <div className='card col-5' style={{ fontSize: "1.3rem", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
                        <div className='col-12' style={{ display: "flex", justifyContent: "flex-start" }}>
                            <ToggleSwitch
                                checked={data.message.activatedn}
                                onLabel={"Activated"}
                                offLabel={"Deactivated"}
                                onChange={handleToggleActivation} // Call the function to toggle activation
                                disabled={loadingActivate} // Disable the toggle switch while loading
                            />
                        </div>
                        <div className="d-flex align-items-center mb-3" style={{ position: "relative" }}>
                            <Avatar name={`${data.message.first_name} ${data.message.last_name}`} size="150" round />
                            <div style={{ position: "absolute", top: "20px", right: "0px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: activated ? "green" : "gray" }}></div>
                        </div>

                        <Dropdown style={{ position: "absolute", right: 20 }}>
                            <Dropdown.Toggle style={{ backgroundColor: "transparent", border: "none", fontSize: "1.5rem", color: "#6c757d", padding: "0" }}>
                                <BiSolidBoltCircle />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">
                                    <button className='btn' style={{ backgroundColor: "red", color: "white" }} onClick={handleDelete}>Delete Lead</button>
                                </Dropdown.Item>
                                {/* Add more dropdown items if needed */}
                            </Dropdown.Menu>
                        </Dropdown>
                        <p>Full Name: {data?.message.first_name} {data.message.last_name}</p>
                        <p>Email: {data.message.email}</p>
                        <p>Phone Number: {data.message.phone_number}</p>
                        <p>Status: {data.message.status}</p>
                        <p>Country: {data.message.country}</p>
                        <p>Address: {data.message.address}</p>
                        <p>Date of Birth: {data.message.dateOfBirth}</p>
                        <p>Activated: {data.message.activated ? 'Yes' : 'No'}</p>
                        <p>Created At: {data.message.createdAt}</p>
                    </div>
                    <div className='card col-5' style={{ fontSize: "1.3rem", padding: "20px" }}>
                        <h2>Edit Lead</h2>
                        <Form>
                            <Form.Group controlId="formFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="firstName" value={firstName} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="formLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="lastName" value={lastName} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={email} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="formPhoneNumber">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type="text" name="phoneNumber" value={phoneNumber} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Select name="status" defaultValue={status} onChange={handleChange}>
                                    <option value="Call back">Call back</option>
                                    <option value="Unavailable">Unavailable</option>
                                    <option value="Not Interested">Not Interested</option>
                                    <option value="Not Called">Not Called</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="formCountry">
                                <Form.Label>Country</Form.Label>
                                <Form.Control type="text" name="country" value={country} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="formAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" name="address" value={address} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="formDateOfBirth">
                                <Form.Label>Date of Birth</Form.Label>
                                {/* <Form.Control
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                /> */}
                                <Form.Control type="text" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

                            </Form.Group>
                            <Form.Group controlId="formActivated">
                                <Form.Check type="checkbox" label="Activated" name="activated" checked={activated} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group controlId="formCreatedAt">
                                <Form.Label>Created At</Form.Label>
                                <Form.Control type="text" name="createdAt" value={createdAt} onChange={handleChange} />
                            </Form.Group>
                            <Button style={{ marginTop: "10px" }} onClick={handleEditLead}>Edit lead</Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
};

export default ViewLead;
