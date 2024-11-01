import { useState, useEffect } from 'react';
import { useGetAllTradesQuery } from '../../../redux-contexts/redux/services/trades';
import { useSelector } from 'react-redux';

const useViewTrade = (fetchDataAndDispatch) => {
    const [autoTrader, setAutoTrader] = useState(false);
    const { userToken } = useSelector(state => state.auth);
    const { data, isFetching, refetch: allTradesRefetch } = useGetAllTradesQuery(userToken);
    const [fills, setFills] = useState("all");

    useEffect(() => {
        allTradesRefetch();
    }, [allTradesRefetch]);

    const handleAutoTrader = () => setAutoTrader(!autoTrader);
    const handleSetFills = (fillsType) => setFills(fillsType);

    return {
        autoTrader,
        data,
        isFetching,
        fills,
        handleAutoTrader,
        handleSetFills,
        allTradesRefetch,
        userToken
    };
};

export default useViewTrade;
