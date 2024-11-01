// src/hooks/useTrade.js

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetAllAssetsQuery, useOpenTradeMutation } from '../../../redux-contexts/redux/services/trades';
import { useGetUserAccountQuery } from '../../../redux-contexts/redux/services/account';
import { setUserAccount } from '../../../redux-contexts/redux/features/account/accountSlice';
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import { RingLoader } from 'react-spinners';

export const useTrade = (userToken, fetchDataAndDispatch) => {
    const dispatch = useDispatch();
    const [tradePair, setTradePair] = useState("ETHBTC");
    const [showChart, setShowChart] = useState(true);
    const { user_id } = useSelector(state => state.userAccount);
    const { data, isLoadingError } = useGetUserAccountQuery(userToken);
    const { data: allAssets = [], error, isLoading } = useGetAllAssetsQuery(userToken, { limit: 10 });
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState('');
    const [orderType, setOrderType] = useState("market");
    const [searchTerm, setSearchTerm] = useState("");
    const [getAssets, setGetAssets] = useState(allAssets);
    const [activeTab, setActiveTab] = useState("buy");
    const [openTradeMutation] = useOpenTradeMutation();

    useEffect(() => {
        const fetchData = () => {
            if (data && !isLoadingError) {
                const { account_type, referral_balance, id, main_balance, bonus_balance } = data;
                dispatch(setUserAccount({ user_id, account_type, referral_balance, id, main_balance, bonus_balance }));
            }
        };

        fetchData();
    }, [data, dispatch, isLoadingError, user_id]);

    useEffect(() => {
        if (searchTerm !== "") {
            setGetAssets(allAssets.filter(asset => asset.asset_pair.toLowerCase().includes(searchTerm.toLowerCase())));
        } else {
            setGetAssets(allAssets);
        }
    }, [allAssets, searchTerm, getAssets]);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const transactionProcessing = () => {
        const loadingElement = ReactDOMServer.renderToString(
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                <RingLoader color="#36d7b7" size={200} />
                <p>Processing Trade...</p>
            </div>
        );

        return Swal.fire({
            title: '',
            html: loadingElement,
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
    };

    const handleTradeOrder = (e) => {
        e.preventDefault();
        Swal.fire({
            title: `Confirm ${activeTab === 'buy' ? 'Buy' : 'Sell'} Order`,
            text: `Are you sure you want to ${activeTab === 'buy' ? 'buy' : 'sell'} $${price} worth ${tradePair}?`,
            icon: 'question',
            showCancelButton: true,
            background: '#131722',
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingToast = transactionProcessing();
                const tradeData = {
                    asset_pair_type: tradePair,
                    amount: parseInt(price),
                    trade_type: orderType,
                    created_by: "self",
                    trade_transaction_type: activeTab === 'buy' ? 'buy' : 'sell'
                };
                openTradeMutation({ token: userToken, data: tradeData })
                    .unwrap()
                    .then((response) => {
                        Swal.close();
                        if (response[0].status === "success") {
                            if (Object.values(response[1].data).length === 0) {
                                fetchDataAndDispatch();
                                Swal.fire({
                                    title: "Trade Opened!",
                                    text: "Trade opened successfully.",
                                    icon: "success",
                                    background: '#131722',
                                });
                            } else {
                                Swal.fire({
                                    title: "Error!",
                                    text: "Insufficient Balance. Please deposit funds to your account.",
                                    icon: "error",
                                    background: '#131722',
                                });
                            }
                        }
                    })
                    .catch((error) => {
                        Swal.close();
                        Swal.fire({
                            title: "Error!",
                            text: "Insufficient Balance. Please deposit funds to your account.",
                            icon: "error",
                            background: '#131722',
                        });
                    });
            }
        });
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleTotalChange = (e) => {
        setTotal(e.target.value);
    };

    const handleOrderTypeClick = (type) => {
        setOrderType(type);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return {
        tradePair,
        showChart,
        price,
        data, 
        isLoadingError,
        amount,
        total,
        orderType,
        searchTerm,
        getAssets,
        activeTab,
        setTradePair,
        setShowChart,
        setPrice,
        setAmount,
        setTotal,
        setOrderType,
        setSearchTerm,
        setGetAssets,
        setActiveTab,
        handleTradeOrder,
        handlePriceChange,
        handleAmountChange,
        handleTotalChange,
        handleOrderTypeClick,
        handleTabClick,
        getRandomColor
    };
};
