/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import BalanceCardSlider from './Dashboard/BalanceCardSlider';
import OrderForm from './Dashboard/OrderForm';
import { LtcIcon, BtcIcon, XtzIcon, EthIcon } from './SvgIcon';
import { Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useOpenTradeMutation } from '../../../redux/services/trades';
import { MyChart } from '../myChart';
import Swal from 'sweetalert2'; // Replace swal with Swal from sweetalert2
import { RingLoader } from 'react-spinners';
import ReactDOMServer from 'react-dom/server';
import { useGetAllAssetsQuery } from '../../../redux/services/trades';
import { Button } from 'react-bootstrap';
import { setUserAccount } from '../../../redux/features/account/accountSlice';
import { useGetUserAccountQuery } from '../../../redux/services/account';
import { IoDiamondSharp } from "react-icons/io5";
import { useResponsive } from '../../../context/responsive';
import { RiTokenSwapFill } from "react-icons/ri";
const marketBlog = [
    { icon: LtcIcon, classBg: 'bg-success', Name: 'LTC', },
    { icon: BtcIcon, classBg: 'bg-warning', Name: 'BTC', },
    { icon: XtzIcon, classBg: 'bg-primary', Name: 'XTZ', },
    { icon: EthIcon, classBg: 'bg-pink', Name: 'ETH', },
    { icon: XtzIcon, classBg: 'bg-primary', Name: 'XTZ', },
];

const Home = ({ theme, fetchDataAndDispatch }) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();
    const dispatch = useDispatch();
    const [tradePair, setTradePair] = useState("ETHBTC")
    const [showChart, setShowChart] = useState(true);
    const { userToken, userInfo } = useSelector(state => state.auth);
    const { user_id } = useSelector(state => state.userAccount)
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const { data, isLoadingError } = useGetUserAccountQuery(userToken);
    const { data: allAssets = [], error, isLoading } = useGetAllAssetsQuery(userToken, { limit: 10 });

    useEffect(() => {
        const fetchData = () => {
            if (data && !isLoadingError) { // Check if data exists
                const { account_type, referral_balance, id, main_balance, bonus_balance } = data;
                dispatch(setUserAccount({ user_id, account_type, referral_balance, id, main_balance, bonus_balance }));
            }
        };

        fetchData();

    }, [data, dispatch, isLoadingError, user_id, userInfo]);
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState('');
    const [orderType, setOrderType] = useState("market");
    const [searchTerm, setSearchTerm] = useState("")
    const [getAssets, setGetAssets] = useState(allAssets)
    const [activeTab, setActiveTab] = useState("buy");
    const [openTradeMutation] = useOpenTradeMutation();
    const handleClick = (pair) => {
        setTradePair(pair);
    };
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    const handleOrderTypeClick = (type) => {
        setOrderType(type);
    }; 

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
        setAmount(event.target.value !== "" ? event.target.value - 0.04 : 0.00);
    };


    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleTotalChange = (event) => {
        setTotal(event.target.value);
    };
    const transactionProcessing = () => {
        const loadingElement = ReactDOMServer.renderToString(
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                <RingLoader color="#36d7b7" size={100} />
                <p>Processing Trade...</p>
            </div>
        );

        return Swal.fire({ // Replace swal with Swal.fire
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
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                // User confirmed the order
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
                        Swal.close(); // Close the loading spinner
                        if(response[0].status === "success"){
                            if (Object.values(response[1].data).length === 0) {
                                fetchDataAndDispatch()
                                Swal.fire({
                                    title: "Trade Opened!",
                                    text: "Trade opened successfully.",
                                    icon: "success",
                                });
                            } else {
                                // Show error modal if status is not success
                                Swal.fire({
                                    title: "Error!",
                                    text: "Insufficient Balance. Please deposit funds to your account.",
                                    icon: "error",
                                });
                            }
                        }
                    })
                    .catch((error) => {
                        // Hide loading spinner on error
                        Swal.close(); // Close the loading spinner
                        // Show error swal for insufficient balance
                        Swal.fire({
                            title: "Error!",
                            text: "Insufficient Balance. Please deposit funds to your account.",
                            icon: "error",
                        });
                        // Add any error handling code here
                    });
            }
        });
    };
    useEffect(() => {
        if (searchTerm !== "") {
            setGetAssets(allAssets.filter(asset => asset.asset_pair.toLowerCase().includes(searchTerm.toLowerCase())));
        } else {
            setGetAssets(allAssets);
        }
    }, [allAssets, searchTerm, getAssets]);


    if (!isLoadingError)
        return (
            <>
                <div className="row" style={{ height: "auto", overflow: "auto" }}>
                    <div className="col-12 col-xl-9">
                        <div className="row">
                            <div className="col-12">
                                <BalanceCardSlider accountData={data} />
                            </div>
                        
                                <div className="col-12 row">  
                                    <div className="col-lg-3 col-12" style={{ height: "580px" }}>
                                        <div className="card" >
                                            <div className="card-header border-0 pb-0">
                                                <h2 className="heading">Assets lists</h2>
                                            </div>
                                            <div style={{ padding: "10px" }}>
                                                <Form.Control type="text" placeholder="Search pair" className="form-control-sm col-12" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} />

                                            </div>
                                            <div className="card-body text-center pt-0 pb-2" style={{ overflow: "auto" }}>
                                                <div className="text-start" style={{ display: "flex", flexDirection: "column", justifyContent: "", gap: "10px" }}>
                                                    {getAssets.map((asset, index) => (
                                                        <div className="previews-info-list" onClick={() => {
                                                            Swal.fire({
                                                                title: 'Asset Selected',
                                                                text: `You have selected ${asset.asset_pair}`,
                                                                icon: 'success'
                                                            }); setTradePair(asset.asset_pair); 
                                                        }} key={index} style={{ position: "relative", cursor: "pointer" }}> {/* Add onClick handler */}
                                                            <div className="pre-icon">
                                                                <div className="ms-2" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                                    <RiTokenSwapFill size={30} color={getRandomColor()} />
                                                                    <h6>{asset.asset_pair}</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card col-lg-9 col-md-12 col-12" style={{position: "relative", zIndex: 1, paddingBottom: "10px", height: "560px"}}>
                                        <div className="card-header border-0 align-items-start flex-wrap pb-0">
                                            <h2 className="heading">Market Chart</h2>

                                        </div>
                                        <MyChart tradePair={tradePair} newTheme={theme} />
                                    </div>
                                </div>
                               
                        
                        </div>
                    </div>
                    <div className="col-xl-3 col-12" style={{ flex: 1 }}>
                        {!isMobile && (
                            <div className="col-12">
                                <div className="card" style={{ height: "250px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
                                        <IoDiamondSharp color='#FF6500' size={50} style={{ filter: 'drop-shadow(0 0 10px #FF6500)' }} />
                                        <p style={{ fontSize: "1.2rem" }}>Upgrade to premium</p>
                                    </div>
                                    <Button onClick={() => {
                                        Swal.fire({
                                            title: "Upgrade Account",
                                            text: "You are not a premium user. Upgrade your account to enjoy more benefits.",
                                            icon: "info",
                                            showCancelButton: true,
                                            confirmButtonText: 'Upgrade',
                                            cancelButtonText: 'Cancel',
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                // Handle Upgrade Account button click here
                                                // Example: Redirect user to upgrade account page or trigger upgrade action
                                                // history.push('/upgrade');
                                            }
                                        });
                                    }}>Upgrade Account</Button>
                                </div>


                            </div>
                        )}
                        <div className="col-12 card" style={{ height: "530px" }}>
                            <Tab.Container defaultActiveKey="Navbuy">
                                <div className="">
                                    <div className="buy-sell">
                                        <Nav className="nav nav-tabs" eventKey="nav-tab2" role="tablist">
                                            <Nav.Link as="button" className={`nav-link ${activeTab === 'buy' ? 'active' : ''}`} onClick={() => handleTabClick('buy')} eventKey="Navbuy" type="button">Buy</Nav.Link>
                                            <Nav.Link as="button" className={`nav-link ${activeTab === 'sell' ? 'active' : ''}`} onClick={() => handleTabClick('sell')} eventKey="Navsell" type="button">Sell</Nav.Link>
                                        </Nav>
                                    </div>
                                    <Tab.Content className='col-12' style={{ margin: "auto", padding: "10px" }}>
                                        <Tab.Pane eventKey="Navbuy" >
                                            <Tab.Container defaultActiveKey="Navbuymarket">
                                                <div className="limit-sell">
                                                    <Nav className="nav nav-tabs" id="nav-tab3" role="tablist">
                                                        <Nav.Link as="button" eventKey="Navsellmarket" className={`nav-link ${orderType === 'market' ? 'active' : ''}`} onClick={() => handleOrderTypeClick('market')}>Market Order</Nav.Link>
                                                        <Nav.Link as="button" eventKey="Navselllimit" className={`nav-link ${orderType === 'limit' ? 'active' : ''}`} onClick={() => handleOrderTypeClick('limit')}>Limit Order</Nav.Link>
                                                    </Nav>
                                                </div>
                                                <Tab.Content id="nav-tabContent1">
                                                    <Tab.Pane eventKey="Navbuymarket"></Tab.Pane>
                                                    <Tab.Pane eventKey="Navbuylimit"></Tab.Pane>
                                                </Tab.Content>
                                                <div className="sell-element">
                                                    <OrderForm
                                                        tradePair={tradePair}
                                                        onPriceChange={handlePriceChange}
                                                        onSubmit={handleTradeOrder}
                                                        amountVal={amount}
                                                        myOrder={orderType}
                                                        activeTab={activeTab}
                                                        onAmountChange={handleAmountChange}
                                                        onTotalChange={handleTotalChange}
                                                    />
                                                </div>
                                            </Tab.Container>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="Navsell">
                                            <Tab.Container defaultActiveKey="Navsellmarket">
                                                <div className="limit-sell">
                                                    <Nav className="nav nav-tabs">
                                                        <Nav.Link as="button" eventKey="Navsellmarket" type="button">market order</Nav.Link>
                                                        <Nav.Link as="button" eventKey="Navselllimit" type="button" >limit order</Nav.Link>
                                                    </Nav>
                                                </div>
                                                <Tab.Content id="nav-tabContent2">
                                                    <Tab.Pane id="Navsellmarket" ></Tab.Pane>
                                                    <Tab.Pane id="Navselllimit" ></Tab.Pane>
                                                </Tab.Content>
                                                <div className="sell-element">
                                                    <OrderForm
                                                        tradePair={tradePair}
                                                        myOrder={orderType}
                                                        orderType={activeTab}
                                                        onPriceChange={handlePriceChange}
                                                        onAmountChange={handleAmountChange}
                                                        onSubmit={handleTradeOrder}
                                                        onTotalChange={handleTotalChange}
                                                    />
                                                </div>
                                            </Tab.Container>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </Tab.Container>
                        </div>
                    </div>
                </div>
            </>
        )
}
export default Home;
