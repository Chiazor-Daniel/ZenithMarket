import React from 'react';
import AdminTable from '../../jsx/components/table/FilteringTable/AdminTable';
import { useNavigate } from 'react-router-dom';
import { useGetSingleAdminQuery } from '../../redux-contexts/redux/services/admin';
import { useGetAllAdminsQuery } from '../../redux-contexts/redux/services/admin';
import { useGetAllUsersQuery } from '../../redux-contexts/redux/services/admin';
import { useSelector } from 'react-redux';
const UserManagement = ({ superAdmin }) => {
    const { adminInfo, adminToken } = useSelector(state => state.adminAuth);
    const navigate = useNavigate()
    const { data: admin, isLoading: isAdminLoading, error: isAdminError, refetch } = useGetSingleAdminQuery({ id: adminInfo.id, adminToken: adminToken });
    const { data: allUsers, isLoading: isUsersLoading, error: isUsersError } = useGetAllUsersQuery(adminToken);
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
    []
  );

  return (
    <div style={{padding: '20px'}}>
      {!isUsersLoading && allUsers && !superAdmin && <AdminTable columns={user_columns} data={allUsers} title={'Users'} />}
      {!isAdminLoading && allUsers && superAdmin && <AdminTable columns={user_columns} data={allUsers} title={'Users'} superAdmin={superAdmin} />}
      {!isAdminLoading && !superAdmin && admin && <AdminTable columns={user_columns} data={admin.users_assigned} title={"Assigned users"} />}
    </div>
  );
};

export default UserManagement;
