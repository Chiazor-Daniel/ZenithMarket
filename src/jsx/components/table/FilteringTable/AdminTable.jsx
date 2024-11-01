/* eslint-disable */
import React, { useMemo, useState } from 'react';
import { useTable, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { GlobalFilter } from './GlobalFilter';
import { Nav, Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './filtering.css';
import Swal from 'sweetalert2';
import { useCreateLeadMutation } from '../../../../redux-contexts/redux/services/admin';
import { useSelector } from 'react-redux';

const AdminTable = ({ data, columns, title, leads, superAdmin, createNewLead, refetch, showFilter, crmFilter }) => {
  const navigate = useNavigate();
  const { adminToken } = useSelector(state => state.adminAuth);
  const [createLead] = useCreateLeadMutation();

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Custom filter function
  const customFilterFunction = (rows, id, filterValue) => {
    if (!filterValue || filterValue.length <= 1) {
      return rows;
    }
  
    const lowerCaseFilter = filterValue.toLowerCase();
  
    return rows.filter(row => {
      return (
        (row.original.first_name && row.original.first_name.toLowerCase().includes(lowerCaseFilter)) ||
        (row.original.last_name && row.original.last_name.toLowerCase().includes(lowerCaseFilter)) ||
        Object.values(row.original).some(value => value && value.toString().toLowerCase().includes(lowerCaseFilter))
      );
    });
  };
  

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      globalFilter: customFilterFunction,
    },
    useFilters,
    useGlobalFilter,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    state: { pageIndex, globalFilter }
  } = tableInstance;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    status: '',
    country: '',
    address: '',
    dateOfBirth: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
      phoneNumber: name === 'phoneNumber' ? parseInt(value) || '' : prevState.phoneNumber,
      dateOfBirth: name === 'dateOfBirth' ? value || '' : prevState.dateOfBirth
    }));
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
          const res = await createLead({
            token: adminToken,
            formData: formData
          });
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

  const handleCrmFilter = (eventKey) => {
    setGlobalFilter(eventKey === 'All' ? '' : eventKey);
  };

  return (
    <>
      <div className="card" style={{ backgroundColor: 'rgba(243, 243, 243, 0.04)' }}>
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 className="card-title">{title}</h4>
          {
            leads && (
              <button className='btn btn-primary' onClick={handleShowModal}>Create new lead</button>
            )
          }
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} w={true} />
              <div>
                {
                  showFilter && (
                    <Nav as="ul" className="order nav-tabs" id="pills-tab" role="tablist">
                      <Nav.Item as="li" className=" my-1" role="presentation">
                        <Nav.Link as="button" eventKey="All" type="button" >All</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className=" my-1" role="presentation">
                        <Nav.Link as="button" eventKey="Spot" type="button">Activated</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className=" my-1" role="presentation">
                        <Nav.Link as="button" className="me-0" eventKey="Listing" type="button">Deactivated</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  )
                }
                {
                  crmFilter && (
                    <Nav as="ul" className="order nav-tabs" id="pills-tab" role="tablist">
                      <Nav.Item as="li" className=" my-1" role="presentation">
                        <Nav.Link as="button" eventKey="All" type="button" onClick={() => handleCrmFilter('All')}>All</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className=" my-1" role="presentation">
                        <Nav.Link as="button" eventKey="Not Called" type="button" onClick={() => handleCrmFilter('Not Called')}>Not Called</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className=" my-1" role="presentation">
                        <Nav.Link as="button" eventKey="Unavailable" type="button" onClick={() => handleCrmFilter('Unavailable')}>Unavailable</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className=" my-1" role="presentation">
                        <Nav.Link as="button" eventKey="Call back" type="button" onClick={() => handleCrmFilter('Call back')}>Call back</Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className=" my-1" role="presentation">
                        <Nav.Link as="button" className="me-0" eventKey="Not Interested" type="button" onClick={() => handleCrmFilter('Not Interested')}>Not Interested</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  )
                }
              </div>
            </div>
            <table {...getTableProps()} className="table dataTable display">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()}>
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell, index) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="d-flex justify-content-between">
              <span>
                Page{' '}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{''}
              </span>
              <span className="table-index">
                Go to page : {' '}
                <input type="number"
                  className="ml-2"
                  defaultValue={pageIndex + 1}
                  onChange={e => {
                    const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                    gotoPage(pageNumber)
                  }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>

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
              <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
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
              <Form.Control type="text" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </Form.Group>
          
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </>
  );
};

export default AdminTable;
