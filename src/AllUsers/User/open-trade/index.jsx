// src/components/IntradayTrading.js

/* eslint-disable */
import React from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { useRef } from 'react';
import { Form } from 'react-bootstrap';
import OrderForm from '../dashboard-components/OrderForm';
import { MyChart } from '../../../jsx/components/myChart';
import ToggleTrade from '../../../jsx/components/toggleTrade';
import { RiTokenSwapFill } from "react-icons/ri";
import { useOpenTrade } from '../../../customHooks/user/trading/useOpenTrade';
import Swal from 'sweetalert2';
import CryptoCurrencyWidget from '../../../jsx/components/cryptoMarquee';
import MyTrader from '../../../jsx/components/myTrade';
import { FaCoins } from "react-icons/fa";
import { FaEthereum } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import ViewStats from '../../../jsx/components/viewStats';
import { useResponsive } from '../../../redux-contexts/context/responsive';
const OpenTrade = ({ fetchDataAndDispatch }) => {
    const {isMobile} = useResponsive()
    const {
        tradePair,
        orderType,
        activeTab,
        searchTerm,
        getAssets,
        price,
        amount,
        total,
        handleClick,
        handleTabClick,
        handleOrderTypeClick,
        handlePriceChange,
        handleAmountChange,
        handleTotalChange,
        handleTradeOrder,
        setSearchTerm,
        getRandomColor
    } = useOpenTrade(fetchDataAndDispatch);
    const chartRef = useRef(null);

    return (
        <>
        <ViewStats />
        <p style={{textAlign: 'center', fontSize: '1.5rem', color: 'white'}}>Assets List</p>
            <div className="asset-list no-scrollbar" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '10px',
                height: '400px',
                borderRadius: '20px',
                overflow: 'auto',
                backgroundColor: 'rgba(243, 243, 243, 0.04)',
                padding: '10px',
                margin: '20px'
            }}>
                <div style={{position: 'relative'}}>
                    <Form.Control type="text" placeholder="Search pair" className="form-control" style={{ backgroundColor: 'transparent', outline: 'none', border: 'none' }} value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} />
                    <div style={{position: "absolute", top: '10px', right: '10px', cursor: 'pointer'}}>
                    <FaSearch color="white" />

                    </div>

                </div>
                {getAssets.map((asset, index) => (
                    <div
                        className="previews-info-list asset"
                        onClick={() => {
                            Swal.fire({
                                title: 'Asset Selected',
                                html: `<span style="color: white;">You have selected ${asset.asset_pair}</span>`,
                                icon: 'success',
                                background: '#131722'
                            });
                            handleClick(asset.asset_pair);
                            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); 
                        }}
                        key={index}
                        style={{
                            position: 'relative',
                            cursor: 'pointer',
                            backgroundColor: '#2c2f33',
                            borderRadius: '5px',
                            padding: '10px',
                            height: '50px',
                        }}
                        >
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <FaCoins size={25} color={getRandomColor()} />
                            <p style={{ margin: 'auto', color: 'white' }}>{asset.asset_pair.slice(0, 3) + "/" + asset.asset_pair.slice(3)}</p>
                        </div>
                    </div>
                ))}
            </div>
        <p style={{textAlign: 'center', fontSize: '1.5rem', color: 'white', marginTop: '50px'}}>Open New Trade</p>

            <div className="row"  ref={chartRef}>
                <div className="col-12 row" style={{ marginTop: '10px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '20px', height: '550px' }}>
                    <div className="col-lg-3 col-12" style={{ height: "100%", backgroundColor: 'rgba(243, 243, 243, 0.04)', borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }}>
                        <div className="col-12" style={{ height: "", display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px', borderRadius: '20px' }}>
                            <div style={{ background: '', paddingTop: '20px', display: 'flex', position: 'relative', flexDirection: 'column', width: '70%', margin: 'auto', borderBottom: '0px solid gray', paddingBottom: '10px' }}>
                                <div className='' style={{ position: 'absolute', right: '-40px' }}>
                                    <ToggleTrade />
                                </div>
                                <p style={{ color: '', fontSize: '1.2rem', textAlign: 'center' }}>Open Trade</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: 'auto' }}><div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'white', fontSize: '1.2rem' }}>
                                            <FaEthereum size={30} style={{ color: '#627eea' }} /> {tradePair.slice(0, 3) + "/" + tradePair.slice(3)}
                                        </span>
                                        <span style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                            {/* <span>
                                                Today
                                            </span>
                                            <span style={{ color: '#06D001', marginLeft: '10px' }}>+2.5%</span> */}
                                        </span>
                                    </div>
                                    <div style={{ height: '100px' }}>
                                        <MyTrader tradePair={tradePair} />
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
                        !isMobile && (
                        <div className="col-9">
                            <MyChart tradePair={tradePair} />
                        </div>
                        )
                    }

                </div>


            </div>
        </>
    );
};

export default OpenTrade;
