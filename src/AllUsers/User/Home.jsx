import React from 'react';
import { Nav, Tab, Form, Button } from 'react-bootstrap';
import BalanceCardSlider from './dashboard-components/BalanceCardSlider';
import OrderForm from './dashboard-components/OrderForm';
import { LtcIcon, BtcIcon, XtzIcon, EthIcon } from './SvgIcon';
import { useSelector } from 'react-redux';
import { MyChart } from '../../jsx/components/myChart';
import Swal from 'sweetalert2';
import { IoDiamondSharp } from "react-icons/io5";
import { useResponsive } from '../../redux-contexts/context/responsive';
import { RiTokenSwapFill } from "react-icons/ri";
import { FaEthereum } from "react-icons/fa6";
import CryptoCurrencyWidget from '../../jsx/components/cryptoMarquee';
import { useTrade } from '../../customHooks/user/userDashboard/useTrade';// Import the custom hook
import MyTrader from '../../jsx/components/myTrade';
import MarketStats from '../../jsx/components/marketStats';
import ForexSymbolList from './foreslist';


const Home = ({ theme, fetchDataAndDispatch }) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();
    const { userToken } = useSelector(state => state.auth);
    const {
        tradePair,
        showChart,
        price,
        amount,
        total,
        orderType,
        searchTerm,
        getAssets,
        activeTab,
        setTradePair,
        setShowChart,
        setPrice,
        data,
        isLoadingError,
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
    } = useTrade(userToken, fetchDataAndDispatch);

    if (!isLoadingError)
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <div className='col-12 row'>
                                <div className="col-lg-9 col-md-6 col-12">
                                    <BalanceCardSlider accountData={data} />
                                </div>
                                <div className='col-lg-3 col-md-6'>
                                {/* <div className="" style={{ height: "", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
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
                                </div> */}
                                {
                                    !isMobile && (
                                       <ForexSymbolList />
                                    )
                                }
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className="" >
                                    <div style={{ padding: "10px" }}>
                                    </div>
                                    <div className="" style={{ display: "flex", justifyContent: "", gap: "10px", backgroundColor: 'rgba(243, 243, 243, 0.04)', paddingLeft: '10px' }}>
                                        <Form.Control type="text" placeholder="Search pair" className="form-control" style={{ width: isMobile ? "100px" : '200px', backgroundColor: 'transparent', outline: 'none', border: 'none' }} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} />
                                        <div style={{display: 'flex', overflow: 'auto'}} className='no-scrollbar'>
                                            {getAssets.map((asset, index) => (
                                                <div className="previews-info-list" onClick={() => {
                                                    Swal.fire({
                                                        title: 'Asset Selected',
                                                        html: `<span style="color: white;">You have selected ${asset.asset_pair}</span>`,
                                                        icon: 'success',
                                                        background: '#131722'
                                                    });
                                                    setTradePair(asset.asset_pair);
                                                }} key={index} style={{ position: "relative", cursor: "pointer" }}> {/* Add onClick handler */}
                                                    <div className="" style={{ display: "flex", gap: "10px", alignItems: "center", }}>
                                                        <RiTokenSwapFill size={25} color={getRandomColor()} />
                                                        <h6 style={{ margin: 'auto' }}>{asset.asset_pair}</h6>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {
                                isTablet && (
                                    <div className="col-12" style={{ position: "relative", zIndex: 1, height: "400px" }}>
                                    <MyChart tradePair={tradePair} newTheme={theme} />
                                </div>
                                )
                            }
                            <div className="col-12 row" style={{ marginTop: '10px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '20px', height: '550px' }}>
                                <div className="col-lg-3 col-12" style={{ height: "100%", backgroundColor: 'rgba(243, 243, 243, 0.04)', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }}>
                                    <div className="col-12" style={{ height: "", display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px', borderRadius: '20px' }}>
                                        <div style={{ background: '', paddingTop: '20px', display: 'flex', flexDirection: 'column', width: '70%', margin: 'auto', borderBottom: '0px solid gray', paddingBottom: '10px' }}>
                                            <p style={{ color: '', fontSize: '1.2rem', textAlign: 'center' }}>Open Trade</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: 'auto' }}><div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ color: 'white', fontSize: '1.2rem' }}>
                                                        <FaEthereum size={30} style={{ color: '#627eea' }} /> {tradePair.slice(0,3) + "/" + tradePair.slice(3)}
                                                    </span>
                                                    <span style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                                        
                                                        {/* <span style={{ color: '#06D001', marginLeft: '10px' }}>+2.5%</span> */}
                                                    </span>
                                                </div>
                                                <div style={{ height: '100px' }}>
                                                    <MyTrader tradePair={tradePair}/>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        <Tab.Container defaultActiveKey="Navbuy">
                                            <div className="">
                                                <div className="">
                                                    <Nav
                                                        className=""
                                                        eventKey="nav-tab2"
                                                        role="tablist"
                                                        style={{
                                                            display: 'flex',
                                                            width: '70%',
                                                            margin: 'auto',
                                                            background: 'rgba(243, 243, 243, 0.04)',
                                                            justifyContent: 'space-between',
                                                            borderRadius: '16px',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        <Nav.Link
                                                            as="button"
                                                            className={`nav-link ${activeTab === 'buy' ? 'active' : ''}`}
                                                            style={{
                                                                background: activeTab === 'buy' ? '#9568FF' : 'transparent',
                                                                width: '50%',
                                                                borderBottomLeftRadius: '16px',
                                                                padding: '10px',
                                                                borderTopRightRadius: '16px',
                                                                borderBottomRightRadius: '16px',
                                                                borderTopLeftRadius: '16px',
                                                                border: 'none',
                                                                color: 'white',
                                                            }}
                                                            onClick={() => handleTabClick('buy')}
                                                            eventKey="Navbuy"
                                                            type="button"
                                                        >
                                                            Buy
                                                        </Nav.Link>
                                                        <Nav.Link
                                                            as="button"
                                                            className={`nav-link ${activeTab === 'sell' ? 'active' : ''}`}
                                                            style={{
                                                                background: activeTab === 'sell' ? '#9568FF' : 'transparent',
                                                                border: 'none',
                                                                width: '50%',
                                                                borderTopLeftRadius: '16px',
                                                                borderRadius: '16px',
                                                                color: 'white',
                                                            }}
                                                            onClick={() => handleTabClick('sell')}
                                                            eventKey="Navsell"
                                                            type="button"
                                                        >
                                                            Sell
                                                        </Nav.Link>
                                                    </Nav>
                                                </div>
                                                <Tab.Content className='col-12' style={{ margin: "auto", padding: "10px" }}>
                                                    <Tab.Pane eventKey="Navbuy" >
                                                        <Tab.Container defaultActiveKey="Navbuymarket">
                                                            <div className="limit-sell">
                                                                <Nav className="nav nav-tabs" id="nav-tab3" role="tablist" style={{ background: 'rgba(243, 243, 243, 0.04)' }}>
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
                                                                    <Nav.Link as="button" eventKey="Navsellmarket" className={`nav-link ${orderType === 'market' ? 'active' : ''}`} onClick={() => handleOrderTypeClick('market')}>Market Order</Nav.Link>
                                                                    <Nav.Link as="button" eventKey="Navselllimit" className={`nav-link ${orderType === 'limit' ? 'active' : ''}`} onClick={() => handleOrderTypeClick('limit')}>Limit Order</Nav.Link>
                                                                </Nav>
                                                            </div>

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
                                {
                                    (!isMobile && !isTablet) && (
                                <div className="col-9" style={{ position: "relative", zIndex: 1, height: "100%" }}>
                                    <MyChart tradePair={tradePair} newTheme={theme} />
                                </div>
                                    )
                                }
                                <CryptoCurrencyWidget />

                            </div>
                        </div>
                    </div>
                    {/* <div className="col-xl-3 col-12" style={{ flex: 1 }}>
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
                       
                    </div> */}
                </div>
            </>
        );
};

export default Home;
