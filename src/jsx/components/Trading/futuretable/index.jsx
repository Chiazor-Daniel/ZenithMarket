import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';
import swal from 'sweetalert';
import axios from 'axios';
import { BASE_URL } from '../../../../api';
import Swal from 'sweetalert2';
import { Form } from 'react-bootstrap';
import { useCreateCustomProfitMutation } from '../../../../redux-contexts/redux/services/admin';
import { Button, Spinner } from 'react-bootstrap'; // Import Spinner component

const FutureTable = ({ fills, tradesData, isLoading, refetchData, userToken, fetchDataAndDispatch, userId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [createCustomProfit] = useCreateCustomProfitMutation();
  const [updatedTrades, setUpdatedTrades] = useState(tradesData);
  const [customProfits, setCustomProfits] = useState({});


  useEffect(() => {
    if (tradesData) {
      setUpdatedTrades(tradesData);
    }
  }, [tradesData]);

  const handleCloseTrade = async (tradeId) => {
    try {
      tradeId = parseInt(tradeId);
      const confirmed = await Swal.fire({
        title: 'Confirm',
        text: 'Are you sure you want to close this trade?',
        icon: 'warning',
        background: '#131722',
        showCancelButton: true,
        confirmButtonText: 'Close Trade',
        cancelButtonText: 'Cancel',
        dangerMode: true,
      });
  
      if (confirmed.isConfirmed) {
        const response = await axios.post(`${BASE_URL}/user/trader/close-trade/${tradeId}`, null, {
          headers: {
            'Content-Type': 'application/json',
            'x-token': userToken,
          },
        });
  
        if (response) {
          refetchData();
          Swal.fire({
            title: 'Success',
            text: 'Trade closed successfully!',
            icon: 'success',
            background: '#131722',
            color: 'white',
          });
          fetchDataAndDispatch && fetchDataAndDispatch();
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message || 'Failed to close the trade. Please try again later.',
            icon: 'error',
            background: '#131722',
            color: 'white',
          });
        }
      }
    } catch (error) {
      console.error('Error closing trade:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to close the trade. Please try again later.',
        icon: 'error',
        background: '#131722',
        color: 'white',
      });
    }
  };

  useEffect(() => {
    if (fills === "open") {
      setUpdatedTrades(tradesData.filter(trade => trade.status.toLowerCase() === "open"));
    } else if (fills === "close") {
      setUpdatedTrades(tradesData.filter(trade => trade.status.toLowerCase() === "closed"));
    } else {
      setUpdatedTrades(tradesData);
    }
  }, [fills, tradesData]);

  useEffect(() => {
    function maxNum(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    const intervalIds = new Map();

    // Create random intervals for each trade
    tradesData.forEach(trade => {
      if(trade.status !== "closed"){

        const intervalTime = Math.random() * (30000 - 3000) + 3000; // Generate random interval time between 500ms and 3000ms
        const intervalId = setInterval(() => {
        setUpdatedTrades(prevTrades => prevTrades.map(prevTrade => {
          if (prevTrade.id === trade.id) {
            const currentProfit = parseFloat(prevTrade.profit);
  
            let minProfit, maxProfit;
  
            if (currentProfit < 0) {
              minProfit = currentProfit / 3; 
              maxProfit = (currentProfit * -1) * 5;
            } else if (currentProfit > 0) {
              minProfit = currentProfit / 5; 
              maxProfit = currentProfit * 3;
            } else {
              // If currentProfit is exactly 0, set default range
              minProfit = -1; // Default minimum
              maxProfit = 1;  // Default maximum
            }

            const modifier = Math.random() < 0.5 ? -1 : 1;
            let newProfit = currentProfit + modifier * maxNum(minProfit, maxProfit);
  
            if (newProfit > maxProfit) {
              newProfit = maxProfit;
            } else if (newProfit < minProfit) {
              newProfit = minProfit;
            }
            
            return {
              ...prevTrade,
              profit: newProfit.toFixed(2),
            };
          } else {
            return prevTrade;
          }
        }));
      }, intervalTime);

      // Use a unique identifier for the interval ID, combining prefix with trade ID
      const uniqueIntervalId = `tradeInterval_${trade.id}`;
      intervalIds.set(uniqueIntervalId, intervalId);
    }
    });
    
    return () => {
      // Clear all intervals when component unmounts
      intervalIds.forEach(intervalId => clearInterval(intervalId));
    };
  }, [tradesData]);


  


  const handleCreateCustomProfit = (tradeId) => {
    Swal.fire({
      icon: 'info',
      title: 'Confirm create custom profit',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: "No",
      confirmButtonText: 'Yes',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const profit = customProfits[tradeId];
        if (profit !== null && profit !== undefined) {
          console.log({
            trade_id: tradeId,
            token: userToken,
            userId: parseInt(userId),
            profit: parseInt(profit)
          })
          const res = await createCustomProfit({
            trade_id: tradeId,
            token: userToken,
            user_id: parseInt(userId),
            profit: profit
          })
          console.log(res)
          if(res.data.status === "success"){
            refetchData()
            Swal.fire({
              icon: "success", 
              title:"Custom profit addedd successfully"
            })
          }else{
            Swal.fire({
              icon: "error", 
              title: "An Error occured"
            })
          }
        } else {
          // Handle error: profit not provided for this trade
        }
      }
    })
  }

  return (
    <>
      <div className="table-responsive dataTablemarket">
        <div id="future_wrapper" className="dataTables_wrapper no-footer">
          <table className="table dataTable shadow-hover display" style={{ minWidth: '845px' }}>
            <thead>
              <tr>
                <th>Asset Pair</th>
                <th className="text-center">Transaction Type</th>
                <th className="text-center">Amount</th>
                <th className="text-center">Profit</th>
                <th className="text-center">Created By</th>
                <th className="text-center">Created At</th>
                <th className="text-end">Status</th>
                <th className="text-end"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </td>
                </tr>
              ) : (
                updatedTrades?.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((trade, index) => (
                  <tr key={index}>
                    <td>
                      <Link to={'#'} className="market-title d-flex align-items-center">
                        <h5 className="mb-0 ms-2"> {trade.asset_pair_type?.substring(0, 3)}</h5>
                        <span className="text-muted ms-2"> {trade.asset_pair_type?.substring(3)}</span>
                      </Link>
                    </td>
                    <td>{trade.trade_type}</td>
                    <td>${trade.amount}</td>
                    <td className={`${trade.profit >= 0 ? 'text-success' : 'text-danger'}`}>{trade.profit}%</td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                      {trade.created_by === 'auto-trader' ? <FaUserCircle /> : <RiAdminFill />}
                      <span>{trade.created_by}</span>
                    </td>
                    <td>{new Date(trade.created_at).toLocaleString()}</td>
                    <td className="text-end">{trade.status}</td>
                    {
                      localStorage.getItem('userType') === 'user' && (
                      <td className="text-end">
                        {trade.status === 'open' ? (
                          <button
                            onClick={() => handleCloseTrade(trade.id)}
                            style={{ background: 'red', border: 'none', padding: '10px', color: 'white', borderRadius: '10px', cursor: 'pointer' }}
                          >
                            Close Trade
                          </button>
                        ) : (
                          <button
                            disabled={true}
                            style={{ background: 'red', border: 'none', padding: '10px', color: 'white', borderRadius: '10px', cursor: 'not-allowed', opacity: 0.5 }}
                          >
                            Close Trade
                          </button>
                        )}
                      </td>
                      )
                    }
                    {
                       (!sessionStorage.getItem('userInfo') && trade.status === 'open') && (
                      <td className=''>
                        <Form.Control
                          size="sm"
                          type="text"
                          style={{ width: '100px', margin: "auto" }}
                          onChange={(e) => setCustomProfits({ ...customProfits, [trade.id]: e.target.value })}
                          value={customProfits[trade.id] || ''} // Set value based on trade ID
                          placeholder="Add custom profit"
                        />
                        <Button className='mt-2' onClick={() => handleCreateCustomProfit(trade.id)}>Add custom profit</Button>
                      </td>

                      )
                    }
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="d-flex justify-content-center mt-3">
            <nav>
              <ul className="pagination">
                {Array.from({ length: Math.ceil(updatedTrades?.length / pageSize) }, (_, index) => (
                  <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(index)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default FutureTable;
