import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetTransactionsQuery } from '../../../redux-contexts/redux/services/transactions';

const useViewTransactions = () => {
  const { userToken } = useSelector(state => state.auth);
  const { data, isLoading } = useGetTransactionsQuery(userToken);

  const [transactionsData, setTransactionsData] = useState([]);
  const [isDataCached, setIsDataCached] = useState(false);

  useEffect(() => {
    if (data && data[1] && !isDataCached) {
      setTransactionsData(data[1].data);
      setIsDataCached(true); // Mark data as cached
    }
  }, [data, isDataCached]);

  useEffect(() => {
    const handleRefetch = () => {
      setIsDataCached(false); // Mark data as not cached to allow refetch
    };


    return () => {

    };
  }, []);

  return { transactionsData, isLoading };
};

export default useViewTransactions;
