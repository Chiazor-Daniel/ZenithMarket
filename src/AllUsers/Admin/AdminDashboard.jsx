/* eslint-disable */
import React, { useEffect, useState } from 'react';
import AdminTable from '../../jsx/components/table/FilteringTable/AdminTable';
import { useGetAllAdminsQuery } from '../../redux-contexts/redux/services/admin';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Finance from './finance';
import { useGetAllUsersQuery } from '../../redux-contexts/redux/services/admin';
import { useGetPaymentDetailsQuery } from '../../redux-contexts/redux/services/paymentDetails';
import { useGetSingleAdminQuery } from '../../redux-contexts/redux/services/admin';
import CreateAdminModal from './createAdmin';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import { useCreateAdminMutation } from '../../redux-contexts/redux/services/admin';

const AdminDashboard = ({setUserType, superAdmin}) => {
  const navigate = useNavigate();
  const { adminInfo, adminToken } = useSelector(state => state.adminAuth);
  const { data: allUsers, isLoading: isUsersLoading, error: isUsersError } = useGetAllUsersQuery(adminToken);
  const { data, error, isLoading, refetch: refetchAdmins } = useGetAllAdminsQuery(adminToken);
  const [createAdmin, { isLoading: isCreatingAdmin }] = useCreateAdminMutation();
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const { data: admin, isLoading: isAdminLoading, error: isAdminError, refetch } = useGetSingleAdminQuery({ id: adminInfo.id, adminToken: adminToken });
  

  const handleRefetch = () => {
    console.log("yuep")
    refetchPaymentDetails();
  };

  const handleCreateAdmin = (formData) => {
    const { email, first_name, last_name, address, country, phone_number, date_of_birth, password } = formData;
    const adminDetails = {
      email,
      first_name,
      last_name,
      address,
      country,
      phone_number,
      date_of_birth,
      password
    };
  
    Swal.fire({
      title: 'Create Admin',
      text: 'Are you sure you want to create this admin?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log({ token: adminToken, details: adminDetails })
        createAdmin({ token: adminToken, details: adminDetails })
          .unwrap()
          .then((response) => {
            console.log(response)
            console.log('Admin created successfully:', response);
            if(response.status){
              refetchAdmins()
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Admin created successfully!',
              });
            }
            setShowCreateAdminModal(false);
          })
          .catch((error) => {
            console.error('Error creating admin:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to create admin. Please try again later.',
            });
          });
      }
    });
  };
  
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
          
          </>
        ),
      },
    ],
    [navigate]
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
          </>
        ),
      },
    ],
    [navigate, admin]
  );
  useEffect(() => {
  console.log(adminInfo)
  }, []);

  const columns = React.useMemo(
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
        accessor: 'id',
        Cell: ({ row }) => (
          <button
            className='btn btn-primary'
            onClick={() => navigate(`/admin/admin-dashboard/admin/${row.original.id}`)}
          >
            View Admin
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div style={{padding: '20px'}}>
       <CreateAdminModal show={showCreateAdminModal} onHide={() => setShowCreateAdminModal(false)} onCreateAdmin={handleCreateAdmin} />
    <div style={{display: "flex", justifyContent:"space-between", alignItems: "center", padding: "10px"}}>
      {
        superAdmin ?(
          <>
          <h1>Admin Management</h1>
          <Button onClick={() => setShowCreateAdminModal(true)}>Create an Admin</Button>
          </>
        ): <h1>User Management</h1>
      }
    </div>
    {isLoading && <div>Loading...</div>}
    {!isLoading && data && superAdmin && <AdminTable columns={columns} data={data} />}
    {!isLoading && allUsers && !superAdmin &&  <AdminTable columns={user_columns} data={allUsers} title={'Users'} />}
    {!isLoading && allUsers && superAdmin && <AdminTable columns={user_columns} data={allUsers} title={'Users'} superAdmin={superAdmin} />}
    {!isLoading && !superAdmin && admin && <AdminTable columns={user_columns} data={admin.users_assigned} title={"Assigned users"} />}
    {isUsersLoading && <div>Loading users...</div>}
  </div>
  
  );
};

export default AdminDashboard;
