/* eslint-disable */
import React from 'react';
import { useSelector } from 'react-redux';
import ReactSlider from 'react-slider';
import { useState } from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
const OrderForm = ({ tradePair, onPriceChange, onAmountChange, onTotalChange, onSubmit, orderType, amountVal, myOrder }) => {
    // Extracting the first and second currencies from the trade pair
    const currency1 = tradePair.substring(0, 3);
    const currency2 = tradePair.substring(3);
    const { main_balance } = useSelector(state => state.userAccount)
    const [value, setValue] = useState(27);

    return (
        <>
            <form onSubmit={onSubmit} style={{ flex: 1, height: "100%" , display: "grid", gap: "20px", margin: "auto"}}>
                <div className="sell-blance">
                    <label className="form-label" style={{color: 'gray'}}>{tradePair}</label>
                    <div className="form-label blance"><span style={{color: 'gray'}}>BALANCE:</span><p style={{color: 'white'}}>${main_balance}</p></div>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="0.00" onChange={onPriceChange} style={{background: 'rgba(243, 243, 243, 0.04)', color: 'white'}}/>
                    </div>
                </div>

                {
                    myOrder === "limit" && (
                    <div style={{ display: "flex", gap: "0px", flexDirection: "column" }}>
                        <p>Risk Management: </p>
                        <RangeSlider
                            value={value}
                            onChange={changeEvent => setValue(changeEvent.target.value)}
                        />
                    </div>
                    )
                }
                <div className="text-center" style={{ marginBottom: "10px" }}>
                    <button type='submit' className="btn btn-primary w-75">{orderType || "Buy"} {currency1}</button> {/* Displaying first currency */}
                </div>
            </form>
        </>
    )
}

export default OrderForm;
