/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap'; // Assuming you're using Bootstrap for the modal and form components

const CreateAdminModal = ({ show, onHide, onCreateAdmin }) => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    address: '',
    country: '',
    phone_number: '',
    date_of_birth: '',
    password: ''
  });
  const [countries, setCountries] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const sortedCountries = response.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        console.log(sortedCountries);
        setCountries(sortedCountries);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateAdmin(formData);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Admin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="first_name">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="last_name">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            {/* <Form.Control type="text" name="country" value={formData.country} onChange={handleChange} required /> */}
            <Form.Select aria-label="" defaultValue={formData.country} onChange={handleChange}>
              {
                countries?.map((c) => <option value={c?.name?.common}>{c?.name?.common}</option>)
              }
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="phone_number">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="date_of_birth">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateAdminModal;
