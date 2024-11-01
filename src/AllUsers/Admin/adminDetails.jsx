/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAllUsersQuery, useGetSingleAdminQuery } from '../../redux-contexts/redux/services/admin';
import { Form, Button, Dropdown } from 'react-bootstrap';
import Avatar from 'react-avatar';
import { BiSolidBoltCircle } from 'react-icons/bi';
import AdminTable from '../../jsx/components/table/FilteringTable/AdminTable';
import Swal from 'sweetalert2';
import { useUpdateUserTransactionMutation } from '../../redux-contexts/redux/services/admin';
import { useAssignLeadToAdminMutation } from '../../redux-contexts/redux/services/admin';
import { useGetAllLeadsQuery } from '../../redux-contexts/redux/services/admin';
import { useAssignUserToAdminMutation } from '../../redux-contexts/redux/services/admin';

const AdminDetails = ({superAdmin}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignLeadToAdmin] = useAssignLeadToAdminMutation()
  const { adminInfo, adminToken } = useSelector(state => state.adminAuth);
  const { data: allUsers, isLoading: isUsersLoading, error: isUsersError } = useGetAllUsersQuery(adminToken);
  const { data: admin, isLoading, error, refetch } = useGetSingleAdminQuery({ id, adminToken });
  const { data: allLeads, refetch: refetchLeads} = useGetAllLeadsQuery({admin_id: id, token: adminToken});
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
        accessor: 'status',
      },
      !superAdmin ? {
        Header: 'Assigned To',
        accessor: 'assigned_to',
        Cell: ({ value }) => (value ? value : 'Not Assigned'),
      } : {
        // Dummy column when superAdmin is false
        Header: '',
        accessor: 'dummy_assigned_to',
        show: false, // Hide this column
      },
      {
        Header: 'Country',
        accessor: 'country',
      },
      {
        Header: 'Date of Birth',
        accessor: 'date_of_birth',
      },
      {
        Header: 'Activated',
        accessor: 'activated',
        Cell: ({ value }) => (value ? 'Yes' : 'No'),
      },
      {
        Header: 'Created At',
        accessor: 'created_at',
      },
      {
        Header: "", 
        accessor: "id", 
        Cell : ({row}) => <Button className='bg-danger'  onClick={() => {
          Swal.fire({
              icon: "info",
              title: "Unassign lead from admin",
              text: `Unassign lead ${row.values.first_name + " " + row.values.last_name} `,
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Unassign',
          }).then(async (result) => {
              if (result.isConfirmed) {
                  try {
                      const res = await assignLeadToAdmin({
                          token: adminToken,
                          lead_id: parseInt(row.values.id),
                          admin_id: id,
                          assign_task: "unassigned"
                      });
                      console.log(res);
                      if(res.data.status === "success"){
                        refetchLeads();
                          Swal.fire({
                              icon: "success", 
                              title: `Unassigned ${row.values.first_name} success`
                          })
                      }else{
                          Swal.fire({
                              icon: "error", 
                              title: "An error occured", 
                              text: "An error occured. Please try again"
                          })
                      }
                  } catch (error) {
                      console.error("Error unassigning lead to admin:", error);
                      Swal.fire({
                          icon: "error", 
                          title: "An error occured", 
                          text: "An error occured. Please try again"
                      })
                  }
              }
          })
      }}>Unassign Lead</Button>
      }
    ],
    []
    );
  const [assignUserToAdminMutation] = useAssignUserToAdminMutation();
  const user_columns = React.useMemo(
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
        Header: 'Password',
        accessor: 'password',
        Cell: ({ value }) => (value ? `${value.substring(0, 10)}...` : 'N/A'),
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ row }) => (
          <>
            <button
              className='btn btn-primary'
              onClick={() => navigate(`/admin/admin-dashboard/user/${row.original.id}`)}
            >
              View User
            </button>
            <button
              className='btn btn-primary ml-4'
              style={{ marginLeft: '10px' }}
              onClick={() =>
                handleAssignUserToAdmin(

                  row.original.id,
                  `${row.original.first_name} ${row.original.last_name}`,
                  admin?.admin_profile, 
                  "assign"
                )
              }
            >
              Assign User to Admin
            </button>
          </>
        ),
      },
    ],
    [navigate, admin]
  );
  const user_columns2 = React.useMemo(
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
        Header: 'Password',
        accessor: 'password',
        Cell: ({ value }) => (value ? `${value.substring(0, 10)}...` : 'N/A'),
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ row }) => (
          <>
            <button
              className='btn btn-primary'
              onClick={() => navigate(`/admin/admin-dashboard/user/${row.original.id}`)}
            >
              View User
            </button>
            <button
              className='btn btn-primary ml-4'
              style={{ marginLeft: '10px', backgroundColor: "red" }}
              onClick={() =>
                handleAssignUserToAdmin(

                  row.original.id,
                  `${row.original.first_name} ${row.original.last_name}`,
                  admin?.admin_profile, 
                  "unassigned"
                )
              }
            >
              Unassign User from Admin
            </button>
          </>
        ),
      },
    ],
    [navigate, admin]
  );

  

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    canAutoTrade: false,
    isActive: false,
  });

  useEffect(() => {
    if (!isLoading && !error && admin) {
      const { admin_profile } = admin;
      setForm({
        firstName: admin_profile?.first_name || '',
        lastName: admin_profile?.last_name || '',
        email: admin_profile?.email || '',
        phoneNumber: admin_profile?.phone_number || '',
        canAutoTrade: admin_profile?.can_auto_trade || false,
        isActive: admin_profile?.is_active || false,
      });
    }
  }, [isLoading, error, admin]);

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = () => {
    // Implement update functionality here
  };

  const handleAssignUserToAdmin = (userId, userName, adminProfile, assign) => {
    if(assign === "assign"){
      Swal.fire({
        title: `Assign user ${userName} to admin ${adminProfile?.first_name} ${adminProfile?.last_name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, assign it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const mutationResult = await assignUserToAdminMutation({
              userId,
              adminId: id,
              adminToken: adminToken,
              assign: assign
            });
            console.log('Mutation result:', mutationResult);
            if (mutationResult?.data.status === "success") {
              refetch();
              Swal.fire(
                'Assigned!',
                `User ${userName} has been assigned to admin ${adminProfile?.first_name} ${adminProfile?.last_name}.`,
                'success'
              );
            }
          } catch (error) {
            console.error('Error assigning user to admin:', error);
            Swal.fire('Error', 'An error occurred while assigning user to admin.', 'error');
          }
        }
      });
    }else {
      Swal.fire({
        title: `Unassign user ${userName} from admin ${adminProfile?.first_name} ${adminProfile?.last_name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Unassign user!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const mutationResult = await assignUserToAdminMutation({ 
              userId,
              adminId: id,
              adminToken: adminToken,
              assign: assign
            });
            console.log('Mutation result:', mutationResult);
            if (mutationResult?.data.status === "success") {
              refetch();
              Swal.fire(
                'Unassigned!',
                `User ${userName} has been unassigned from admin ${adminProfile?.first_name} ${adminProfile?.last_name}.`,
                'info'
              );
            }
          } catch (error) {
            console.error('Error assigning user to admin:', error);
            Swal.fire('Error', 'An error occurred while assigning user to admin.', 'error');
          }
        }
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className='row'>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>Admin Details</h1>
          {/* Add button or link for navigation if needed */}
        </div>
        <div className='card col-5' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontSize: '1.3rem', margin: 'auto' }}>
          {/* Display admin profile details */}
          <Dropdown style={{ position: 'absolute', right: 20 }}>
            <Dropdown.Toggle style={{ backgroundColor: 'transparent', border: 'none', fontSize: '1.5rem', color: '#6c757d', padding: '0' }}>
              <BiSolidBoltCircle />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href='#/action-1'>
                <button className='btn' style={{ backgroundColor: 'red', color: 'white' }}>Delete Admin</button>
              </Dropdown.Item>
              <Dropdown.Item href='#/action-2'></Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className='d-flex align-items-center mb-3' style={{ position: 'relative' }}>
            <Avatar name={`${form.firstName} ${form.lastName}`} size='150' round />
            <div style={{ position: 'absolute', top: '20px', right: '0px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: form.isActive ? 'green' : 'gray' }}></div>
          </div>
          <p className='ml-3'>{form.firstName} {form.lastName}</p>
          <p>Email: {form.email}</p>
          <p>Phone Number: {form.phoneNumber}</p>
          <p>Can Auto Trade: {form.canAutoTrade ? 'Yes' : 'No'}</p>
          <p>Is Active: {form.isActive ? 'Yes' : 'No'}</p>
          {/* Add any additional details here */}
          <div className='row' style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* <button className='btn btn-primary'>
              Login User Account
            </button> */}
          </div>
        </div>
        <div className='card col-5' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontSize: '1.3rem', margin: 'auto' }}>
          <h2>Edit Admin Profile</h2>
          <div className='row'>
            <div className='col-6'>
              <Form.Group className='mb-3' controlId='formFirstName'>
                <Form.Label>First Name</Form.Label>
                <Form.Control type='text' placeholder='Enter first name' name='firstName' value={form.firstName} onChange={handleInputChange} />
              </Form.Group>
            </div>
            <div className='col-6'>
              <Form.Group className='mb-3' controlId='formLastName'>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type='text' placeholder='Enter last name' name='lastName' value={form.lastName} onChange={handleInputChange} />
              </Form.Group>
            </div>
          </div>
          <div className='row'>
            <div className='col-6'>
              <Form.Group className='mb-3' controlId='formEmail'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' placeholder='Enter email' name='email' value={form.email} onChange={handleInputChange} />
              </Form.Group>
            </div>
            <div className='col-6'>
              <Form.Group className='mb-3' controlId='formPhoneNumber'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type='tel' placeholder='Enter phone number' name='phoneNumber' value={form.phoneNumber} onChange={handleInputChange} />
              </Form.Group>
            </div>
          </div>
          <div className='row'>
            <div className='col-6'>
              <Form.Group className='mb-3' controlId='formCanAutoTrade'>
                <Form.Check
                  type='checkbox'
                  label='Can Auto Trade'
                  name='canAutoTrade'
                  checked={form.canAutoTrade}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </div>
            <div className='col-6'>
              <Form.Group className='mb-3' controlId='formIsActive'>
                <Form.Check
                  type='checkbox'
                  label='Is Active'
                  name='isActive'
                  checked={form.isActive}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </div>
          </div>
          <div className='row' style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button onClick={handleUpdate}>
              Update Admin Profile
            </Button>
          </div>
          <div className='' style={{ padding: '30px', display: 'flex', justifyContent: 'center', width: '100%', gap: '20px' }}>
            <Button>
              Reset Admin Password
            </Button>
          </div>
        </div>
      </div>
      <div className='row' style={{ padding: '30px' }}>
        {
          Array.isArray(admin?.users_assigned) && (
            <AdminTable columns={user_columns2} data={admin?.users_assigned} title={"Assigned users"} />
          )
        }
      </div>
      
      <div className='row' style={{ padding: '20px' }}>
        {
          allUsers && (
            <AdminTable columns={user_columns} data={allUsers} title={'Assigns Users'} />
          )
        }
      </div>
      <div className='row' style={{ padding: '20px' }}>
        {
          Array.isArray(allLeads?.message) && (
            <AdminTable columns={crmLeads} data={allLeads?.message} title={'Assigned Leads'} />
          )
        }
      </div>
    </div>
  );
};

export default AdminDetails;
