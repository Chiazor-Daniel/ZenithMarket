import React from 'react';
import { useGetPaymentDetailsQuery } from '../../redux-contexts/redux/services/paymentDetails';
import { useSelector } from 'react-redux';
import Finance from './finance'; // Assuming 'Finance' component is imported from the correct location

const AdminFinance = ({ setUserType, superAdmin }) => {
  const { adminToken } = useSelector(state => state.adminAuth);
  const { data: paymentDetails, isLoading, error, refetch: refetchPaymentDetails } = useGetPaymentDetailsQuery(adminToken);

  if (isLoading) {
    return <div>Loading payment details...</div>; // Render a loading indicator while fetching data
  }

  if (error) {
    return <div>Error fetching payment details: {error.message}</div>; // Handle error case
  }

  return (
    <Finance paymentDetails={paymentDetails?.data} token={adminToken} refetch={refetchPaymentDetails} />
  );
};

export default AdminFinance;
