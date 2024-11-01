/* eslint-disable */
import React from 'react';
import FutureTable from '../../../jsx/components/Trading/futuretable';
import { Tab, Nav } from 'react-bootstrap';
import ToggleTrade from '../../../jsx/components/toggleTrade';
import useViewTrade from '../../../customHooks/user/trading/useViewTrade';

const ViewTrade = ({ fetchDataAndDispatch }) => {
    const {
        autoTrader,
        data,
        isFetching,
        fills,
        handleAutoTrader,
        handleSetFills,
        allTradesRefetch,
        userToken
    } = useViewTrade(fetchDataAndDispatch);

    return (
        <div style={{padding: '20px'}}>
            <div className="card" style={{backgroundColor: 'rgba(243, 243, 243, 0.04)'}}>
                <Tab.Container defaultActiveKey="All">
                    <div className="card-header border-0">
                        <Nav as="ul" className="order nav-tabs" id="pills-tab" role="tablist">
                            <Nav.Item as="li" className="my-1" role="presentation">
                                <Nav.Link as="button" eventKey="All" type="button" onClick={() => handleSetFills("all")}>All Trade</Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="my-1" role="presentation">
                                <Nav.Link as="button" eventKey="Spot" type="button" onClick={() => handleSetFills("open")}>Opened</Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="my-1" role="presentation">
                                <Nav.Link as="button" className="me-0" eventKey="Listing" type="button" onClick={() => handleSetFills("close")}>Closed</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <ToggleTrade />
                    </div>
                    <div className="card-body pt-0">
                        {
                            data && (
                                <FutureTable
                                    tradesData={data[1]?.data}
                                    isLoading={isFetching}
                                    refetchData={allTradesRefetch}
                                    fills={fills}
                                    fetchDataAndDispatch={fetchDataAndDispatch}
                                    userToken={userToken}
                                />
                            )
                        }
                    </div>
                </Tab.Container>
            </div>  
        </div>
    );
};

export default ViewTrade;
