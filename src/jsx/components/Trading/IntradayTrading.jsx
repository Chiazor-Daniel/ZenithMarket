/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import OrderForm from '../Dashboard/Dashboard/OrderForm';
import { MyChart } from '../myChart';
import ToggleTrade from '../toggleTrade';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useGetAllAssetsQuery } from '../../../redux-contexts/redux/services/trades';
import { RiTokenSwapFill } from "react-icons/ri";
import ReactDOMServer from 'react-dom/server';
import { useOpenTradeMutation } from '../../../redux-contexts/redux/services/trades';
import { RingLoader } from 'react-spinners';
import swal from 'sweetalert';
const IntradayTrading = ({ fetchDataAndDispatch }) => {
    const { userToken } = useSelector(state => state.auth);
    const { data: allAssets = [], error, isLoading } = useGetAllAssetsQuery(userToken);
    const [getAssets, setGetAssets] = useState(allAssets)
    const [tradePair, setTradePair] = useState("NEOBTC"); // Initialize tradePair state
    const [orderType, setOrderType] = useState("market");
    const [activeTab, setActiveTab] = useState("buy");
    const [openTradeMutation] = useOpenTradeMutation();
    const [searchTerm, setSearchTerm] = useState("")

    // Function to generate random color
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    // Function to handle click event and set tradePair
    const handleClick = (pair) => {
        setTradePair(pair);
        Swal.fire({
            title: 'Asset Selected',
            text: `You have selected ${pair}`,
            icon: 'success'
        });
    }
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    const handleOrderTypeClick = (type) => {
        setOrderType(type);
    };
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('232');
    const [total, setTotal] = useState('');

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

        return Swal.fire({
            title: '',
            html: loadingElement,
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
                        console.log("Trade response:", response);
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
                        console.error("Error opening trade:", error);
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
    }, [allAssets, searchTerm]);
    

    return (
        <>
            <div className='row' style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <ToggleTrade />
            </div>
            <div className="row">
                <div className="col-xl-8">
                    <div className="card" style={{ height: "600px" }}>
                        <div className="card-header" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                            <div className="me-auto" style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                                <h4 className="fs-20 text-black">Trading Chart</h4>
                                {/* <Link to="#" className="btn btn-primary light btn-rounded me-3 mb-3">
                                    <i className="las la-download scale5 me-2"></i>Get Report
                                </Link> */}
                            </div>
                            <MyChart tradePair={tradePair} />
                        </div>
                    </div>
                    <div className="col-xl-12 col-sm-12" style={{ height: "500px" }}>
                        <div className="card h-100">
                            <div className="px-0">
                                <Tab.Container defaultActiveKey="Navbuy">
                                    <div className="">
                                        <div className="buy-sell">
                                            <Nav className="nav nav-tabs" eventKey="nav-tab2" role="tablist" style={{ padding: 12 }}>
                                                <Nav.Link as="button" className={`nav-link ${activeTab === 'buy' ? 'active' : ''}`} onClick={() => handleTabClick('buy')} eventKey="Navbuy" type="button">Buy</Nav.Link>
                                                <Nav.Link as="button" className={`nav-link ${activeTab === 'sell' ? 'active' : ''}`} onClick={() => handleTabClick('sell')} eventKey="Navsell" type="button">Sell</Nav.Link>
                                            </Nav>
                                        </div>
                                        <Tab.Content className='col-11' style={{ margin: "auto", padding: "10px" }}>
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
                                                            onAmountChange={handleAmountChange}
                                                            onTotalChange={handleTotalChange}
                                                        />
                                                    </div>
                                                </Tab.Container>
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="Navsell">
                                                <Tab.Container defaultActiveKey="Navsellmarket">
                                                    <div className="limit-sell">
                                                    <Nav className="nav nav-tabs" id="nav-tab3" role="tablist">
                                                            <Nav.Link as="button" eventKey="Navsellmarket" className={`nav-link ${orderType === 'market' ? 'active' : ''}`} onClick={() => handleOrderTypeClick('market')}>Market Order</Nav.Link>
                                                            <Nav.Link as="button" eventKey="Navselllimit" className={`nav-link ${orderType === 'limit' ? 'active' : ''}`} onClick={() => handleOrderTypeClick('limit')}>Limit Order</Nav.Link>
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
                </div>
                <div className="col-xl-4" style={{ height: "1120px", overflow: "hidden" }}>
                    <div className="card h-100">
                        <div className="card-header">
                            <h4 className="fs-20 text-black">Asset List</h4>
                        </div>
                        <div>
                        <div style={{padding: "10px"}}>

                            <Form.Control type="text" placeholder="Search pair" className="form-control-sm col-6" value={searchTerm} onChange={(e)=> {setSearchTerm(e.target.value)}}/>
                            <Form.Select style={{ marginTop: "10px" }}>
                                <option>Crypto</option>
                                <option>Forex</option>
                            </Form.Select>
                        </div>
                        </div>
                        <div className="card-body" style={{ padding: "10px", maxHeight: "calc(100% - 50px)", overflow: "auto" }}>
                            <div className="row" style={{ flex: 1 }}>
                                {getAssets?.map((asset, index) => (
                                    <div className="previews-info-list" key={index} style={{ position: "relative", cursor: "pointer", marginBottom: "10px" }} onClick={() => handleClick(asset.asset_pair)}> {/* Add onClick handler */}
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

            </div>
        </>
    );
};

export default IntradayTrading;
