/* eslint-disable */
import React, { useEffect, useState } from 'react'
import FutureTable from './futuretable'
import { Tab, Nav } from 'react-bootstrap';
import ToggleTrade from '../toggleTrade';
import { useSelector } from 'react-redux';
import { useGetAllTradesQuery } from '../../../redux/services/trades';
const ViewTrade = ({fetchDataAndDispatch}) => {
    const [autoTrader, setAutoTrader] = useState(false)
    const { userToken } = useSelector(state => state.auth);
    const { data, isFetching, refetch: allTradesRefecth } = useGetAllTradesQuery(userToken);
    const handleAutoTrader = () => setAutoTrader(!autoTrader)
    const [fills, setFills] = useState("all")
    useEffect(()=>{
        allTradesRefecth();
    }, [])
    console.log(data)
    return (
        <div className=''>
            <div className="col-xl-12">
                <div className="card">
                    <Tab.Container defaultActiveKey="All">
                        <div className="card-header border-0">
                            <Nav as="ul" className="order  nav-tabs" id="pills-tab" role="tablist">
                                <Nav.Item as="li" className=" my-1" role="presentation">
                                    <Nav.Link as="button" eventKey="All" type="button" onClick={()=>setFills("all")}>All Trade</Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li" className=" my-1" role="presentation">
                                    <Nav.Link as="button" eventKey="Spot" type="button" onClick={()=>setFills("open")}>Opened</Nav.Link>
                                </Nav.Item>
                                <Nav.Item as="li" className=" my-1" role="presentation">
                                    <Nav.Link as="button" className="me-0" eventKey="Listing" type="button" onClick={()=>setFills("close")}>Closed</Nav.Link>
                                </Nav.Item>
                            </Nav>    
                            <ToggleTrade />
                        </div>
                        <div className="card-body pt-0">
                            {
                                data && (
                                    <FutureTable tradesData={data[1]?.data} isLoading={isFetching} refetchData={allTradesRefecth} fills={fills} fetchDataAndDispatch={fetchDataAndDispatch} userToken={userToken}/>
                                )
                            }
                        </div>
                    </Tab.Container>
                </div>
            </div>
        </div>
    )
}

export default ViewTrade