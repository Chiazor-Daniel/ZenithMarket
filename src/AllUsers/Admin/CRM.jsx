/* eslint-disable */
import React, { useState, useEffect } from 'react';
import AdminTable from '../../jsx/components/table/FilteringTable/AdminTable';
import { useDeleteLeadMutation, useGetAllLeadsQuery } from '../../redux-contexts/redux/services/admin';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Form, Modal } from 'react-bootstrap';
import { useCreateLeadMutation } from '../../redux-contexts/redux/services/admin';
import Swal from 'sweetalert2';
import { FaCommentDots } from 'react-icons/fa';
import { useEditLeadMutation } from '../../redux-contexts/redux/services/admin';
import { handleEditLead } from './handleEditLEad';

const CRM = ({ superAdmin }) => {
  const navigate = useNavigate();
  const { adminInfo, adminToken } = useSelector(state => state.adminAuth);
  const [createLead] = useCreateLeadMutation();
  const [editLead] = useEditLeadMutation();
  const [deleteLead] = useDeleteLeadMutation();
  const { data: allLeads, isLoading, error, refetch } = useGetAllLeadsQuery({ admin_id: adminInfo.id, token: adminToken });
  const [showModal, setShowModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  const [comment, setComment] = useState('');

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  const handleCommentClose = () => setCommentModal(false);
  const handleCommentShow = (id) => {
    setCurrentLeadId(id);
    setCommentModal(true);
  };
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    status: '',
    country: '',
    address: '',
    dateOfBirth: '',
    activated: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = () => {
    // Implement your logic to add the comment for the lead with id = currentLeadId
    console.log('Adding comment:', comment, 'to lead:', currentLeadId);
    handleCommentClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Confirm lead creation',
      text: 'Are you sure you want to create this lead?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log("formData", formData);
          const res = await createLead({
            token: adminToken,
            formData: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone_number: formData.phoneNumber,
              status: formData.status,
              country: formData.country,
              address: formData.address,
              date_of_birth: formData.dateOfBirth,
              activated: formData.activated,
              created_at: formData.createdAt
            }
          });
          console.log(res);
          if (res.data.status === "success") {
            refetch();
            Swal.fire({
              title: 'Lead created successfully',
              icon: 'success',
              confirmButtonColor: '#3085d6'
            });
            handleCloseModal();
          } else {
            refetch();
            throw new Error('An error occurred while creating the lead.');
          }
        } catch (error) {
          refetch();
          Swal.fire({
            title: 'Error',
            text: `An error occurred while creating the lead`,
            icon: 'error',
            confirmButtonColor: '#3085d6'
          });
        }
      }
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Confirm delete lead',
      text: 'Are you sure you want to delete this lead?',
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
        });
        try {
          const res = await deleteLead({
            token: adminToken,
            lead_id: id,
            admin_id: adminInfo.id
          });
          console.log("this res", res);
          if (res.data.status === "success") {
            refetch();
            Swal.fire({
              title: 'Lead deleted successfully',
              icon: 'success',
              confirmButtonColor: '#3085d6'
            });
          } else {
            refetch();
            throw new Error('An error occurred while deleting the lead.');
          }
        } catch (error) {
          refetch();
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

  const crmLeads = React.useMemo(
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
  Header: 'Status',
  accessor: 'tatus',
  Cell: ({ row: { original }, value }) => {
    return (
      <Form.Select 
        name="status" 
        defaultValue={value} 
        onChange={(e) => {
          handleEditLead({
            adminInfo, 
            adminToken, 
            formData: {...original, status: e.target.value, firstName: original.first_name, lastName: original.last_name, dateOfBirth: original.date_of_birth, phoneNumber: original.phone_number }, 
            editLead, 
            refetch,
            id: original.id
          });
        }}
      >
        <option value="Call back">Call back</option>
        <option value="Unavailable">Unavailable</option>
        <option value="Not Interested">Not Interested</option>
        <option value="Not Called">Not Called</option>
      </Form.Select>
    );
  },
},
      {
        Header: 'Country',
        accessor: 'country',
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ value }) => (
          <div style={{ display: "flex", gap: "20px" }}>
            <button className='btn btn-primary' onClick={() => navigate(`/admin/admin-dashboard/lead/${value}`)}>View lead</button>
            <div>
              <FaCommentDots onClick={() => handleCommentShow(value)} style={{ cursor: 'pointer', fontSize: '20px', color: 'blue' }} />
            </div>
          </div>
        ),
      },
    ],
    [handleEditLead]
  );

  useEffect(() => {
    console.log("allLeads:", allLeads);
  }, [allLeads]);

  if (isLoading) {
    return <Spinner animation="border" />;
  } else if (Array.isArray(allLeads?.message)) {
    return (
      <div style={{ padding: '20px' }}>
        <AdminTable crmFilter={true} columns={crmLeads} data={allLeads?.message} title={"All Leads"} leads={true} createNewLead={handleSubmit} refetch={refetch} superAdmin={superAdmin} />
        <Modal show={commentModal} onHide={handleCommentClose} size="md">
          <Modal.Header closeButton>
            <Modal.Title>Add Comment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formComment">
                <Form.Label>Comment</Form.Label>
                <Form.Control type="text" value={comment} onChange={handleCommentChange} />
              </Form.Group>
              <Button variant="primary" onClick={handleAddComment} className='mt-3'>
                Add Comment
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  } else {
    return (
      <div>No data available {superAdmin && <Button onClick={handleShowModal}>Create Lead</Button>}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Create New Lead</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formStatus">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" defaultValue={formData.status} onChange={handleChange}>
                  <option value="Call back">Call back</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Not Called">Not Called</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="formCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" name="country" value={formData.country} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formDateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formActivated">
                <Form.Check type="checkbox" label="Activated" name="activated" checked={formData.activated} onChange={handleChange} />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
};

export default CRM;
