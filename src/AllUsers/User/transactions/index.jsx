/* eslint-disable */
import React from 'react';
import { Spinner } from 'react-bootstrap';
import FilteringTable from '../../../jsx/components/table/FilteringTable/FilteringTable';
import useViewTransactions from '../../../customHooks/user/transactions/useViewTransactions';

const ViewTransactions = () => {
  const { transactionsData, isLoading } = useViewTransactions();

  return (
    <div>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <FilteringTable data={transactionsData} isLoading={isLoading} />
      )}
    </div>
  );
};

export default ViewTransactions;
