/* eslint-disable */
import React, { useState } from 'react';
import { AiFillBank } from 'react-icons/ai';
import { HiBanknotes } from 'react-icons/hi2';
import { FaCoins, FaCopy } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { SiMastercard } from "react-icons/si";
import { FaCcVisa } from "react-icons/fa";
import { MdError } from "react-icons/md";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MdRunningWithErrors } from "react-icons/md";
import { PiBankFill } from "react-icons/pi";
import useDeposit from '../../../customHooks/user/transactions/useDeposit';

const buttons = [
    { icon: <AiFillBank size={25} />, text: 'Bank transfer' },
    { icon: <FaCoins size={25} />, text: 'Crypto' },
    { icon: <HiBanknotes size={25} />, text: 'Card payment' }
];

const Deposit = ({ fetchDataAndDispatch }) => {
    const {
        activeButton,
        handleButtonClick,
        formData,
        handleInputChange,
        cardType,
        selectedNetwork,
        handleNetworkChange,
        handleWalletAddressCopy,
        copied,
        handleCryptoDeposit,
        handleBankPayment,
        handleCardPay,
        amount,
        preferredToken,
        setAmount,
        cryptoDetails,
        bankDetails,
        paymentType,
    } = useDeposit();

    const [withdrawBank, setWithdrawbank] = useState("");

    return (
        <div className='row p-4' style={{ display: 'flex', gap: '30px', height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                {buttons.map((button, index) => (
                    <button
                        key={index}
                        className={`btn p-4 ${activeButton === index ? 'active' : ''} col-lg-2 col-4`}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(243, 243, 243, 0.04)' }}
                        onClick={() => handleButtonClick(index)}
                    >
                        {button.icon}
                        <span>{button.text}</span>
                    </button>
                ))}
            <div className='card col-lg-9 p-4' style={{ height: '100%', backgroundColor: 'rgba(243, 243, 243, 0.04)' }}>
                <h1>Deposit via <span>{buttons[activeButton]?.text}</span></h1>
                {activeButton === 1 ? (
                    cryptoDetails?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div>
                                <p>Network Chain</p>
                                <Form.Select size='lg' onChange={handleNetworkChange} style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}}>
                                    <option value="" style={{backgroundColor: 'rgba(243, 243, 243, 0.04)'}} disabled selected>Select Network</option>
                                    {cryptoDetails?.map(detail => (
                                        <option key={detail.id} value={detail.network_chain}>{detail.network_chain}</option>
                                    ))}
                                </Form.Select>
                            </div>
                            <div>
                                <p>Preferred Token:</p>
                                <Form.Control
                                style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}}
                                    aria-label='Wallet Address'
                                    placeholder='Preferred Token'
                                    value={preferredToken}
                                    readOnly
                                />
                            </div>

                            {cryptoDetails && (
                                <div>
                                    <p>Wallet Address:</p>
                                    <InputGroup className='mb-3' size='lg' >
                                        <Form.Control
                                        style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}}
                                            aria-label='Wallet Address'
                                            placeholder='Wallet Address'
                                            value={formData.walletAddress}
                                            readOnly
                                        />
                                        <OverlayTrigger
                                            trigger="hover"
                                            placement="top"
                                            overlay={
                                                <Tooltip id={`tooltip-top`}>
                                                    {copied ? "Copied" : "Copy"} to Clipboard
                                                </Tooltip>
                                            }
                                        >
                                            <InputGroup.Text style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}} onClick={handleWalletAddressCopy}>
                                                <FaCopy />
                                            </InputGroup.Text>
                                        </OverlayTrigger>
                                    </InputGroup>
                                </div>
                            )}
                            <div className='row col-4'>
                                <InputGroup className='mb-0' size='lg'>
                                    <InputGroup.Text style={{ cursor: 'pointer', backgroundColor: '#131722', border: 'none' }} >$</InputGroup.Text>
                                    <Form.Control  style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}} aria-label='Amount (to the nearest dollar)' placeholder='Enter Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
                                </InputGroup>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} className='p-4' >
                                <button className='btn btn-primary' onClick={() => handleCryptoDeposit()}>Make Deposit</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: "400px", justifyContent: "center", alignItems: "center" }}>
                            <MdRunningWithErrors color='gray' size={50} style={{ fontSize: "1rem", opacity: 0.5 }} />
                            <p style={{ fontSize: "2rem", opacity: 0.5 }}>Method Unavialable in your Region</p>
                        </div>
                    )
                ) : null}
                {activeButton === 0 ? (
                    !bankDetails?.length > 0 && Array.isArray(bankDetails) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className='row'>
                                {bankDetails.map((detail, index) => (
                                    <div key={index} style={{ fontSize: "1.2rem", margin: "10px", padding: "10px", cursor: "pointer" }} className='card col-5' onClick={() => setWithdrawbank(detail.iban)}>
                                        <div style={{ position: "absolute", right: 0, top: 0 }}>
                                            <PiBankFill color='green' size={30} />
                                        </div>
                                        <p>Bank Name: {detail.bank_name}</p>
                                        <p>Account Name: {detail.account_name}</p>
                                        <p>IBAN: {detail.iban}</p>
                                        <p>BIC: {detail.bic}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='row'>
                                <div className='col-4'>
                                    <p style={{ fontSize: "1.2rem" }}>Bank Account IBAN: </p>
                                    <InputGroup className='mb-0' size='lg'>
                                        <InputGroup.Text style={{ cursor: 'pointer', backgroundColor: '#131722' , border: 'none' }}><FaCopy /></InputGroup.Text>
                                        <Form.Control style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}} aria-label='Bank Account Number' placeholder={withdrawBank} readOnly />
                                    </InputGroup>
                                </div>
                                <div className='col-4'>
                                    <p style={{ fontSize: "1.2rem" }}>Amount: </p>
                                    <InputGroup className='mb-0' size='lg'>
                                       <InputGroup.Text style={{ cursor: 'pointer', backgroundColor: '#131722' , border: 'none' }}>$</InputGroup.Text>
                                       <Form.Control style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}} aria-label='Amount (to the nearest dollar)' placeholder='Enter Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
                                   </InputGroup>
                               </div>
                           </div>
                           <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} className='p-4'>
                               <button className='btn btn-primary' onClick={handleBankPayment}>Make Deposit</button>
                           </div>
                       </div>
                   ) : (
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: "400px", justifyContent: "center", alignItems: "center" }}>
                           <MdRunningWithErrors color='gray' size={50} style={{ fontSize: "1rem", opacity: 0.5 }} />
                           <p style={{ fontSize: "2rem", opacity: 0.5 }}>Method Unavialable in your Region</p>
                       </div>
                   )
               ) : null}

               {activeButton === 2 && (
                   <React.Fragment>
                       <Form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                           <Form.Group controlId="cardHolder">
                               <Form.Label> Card Holder Name</Form.Label>
                               <Form.Control  style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}} type="text" placeholder="Enter card holder name" value={formData.cardHolder} onChange={handleInputChange} />
                           </Form.Group>
                           <Form.Group controlId="cardNumber">
                               <Form.Label>Card Number</Form.Label>
                               <InputGroup>
                                   <InputGroup.Text style={{backgroundColor: '#131722', border: 'none' }} id="basic-addon1" >
                                       {formData.cardNumber.length <= 15 ? (
                                           cardType === 'mastercard' ? <SiMastercard size={20} /> :
                                               cardType === 'visa' ? <FaCcVisa size={20} /> :
                                                   <MdError size={20} color='#E72929' />
                                       ) : <MdError size={20} color='#E72929' />}
                                   </InputGroup.Text>
                                   <Form.Control style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}}  type="text" placeholder="Enter credit card number" value={formData.cardNumber} onChange={handleInputChange} />
                               </InputGroup>
                               <p>
                                   {formData.cardNumber.length <= 15 ? (
                                       cardType === 'mastercard' ? 'Mastercard' :
                                           cardType === 'visa' ? 'Visa' :
                                               'Invalid card'
                                   ) : 'Invalid card'}
                               </p>
                           </Form.Group>
                           <div className='row'>
                               <Form.Group controlId="expiryDate" className='col-lg-4'>
                                   <Form.Label>Expiry Date</Form.Label>
                                   <div className='row' style={{ display: "flex", alignItems: "center" }}>
                                       <Form.Group controlId="expiryMonth" className='col-lg-4'>
                                           <Form.Control style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}}  type="text" placeholder="MM" value={formData.expiryDate.substring(0, 2)} onChange={(e) => handleInputChange({ target: { id: "expiryDate", value: e.target.value + formData.expiryDate.substring(2) } })} />
                                       </Form.Group>
                                       <span className='col-lg-1'>/</span>
                                       <Form.Group controlId="expiryYear" className='col-lg-4'>
                                           <Form.Control style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}}  type="text" placeholder="YY" value={formData.expiryDate.substring(3)} onChange={(e) => handleInputChange({ target: { id: "expiryDate", value: formData.expiryDate.substring(0, 3) + e.target.value } })} />
                                       </Form.Group>
                                   </div>
                               </Form.Group>
                               <Form.Group controlId="cvv" className='col-lg-4'>
                                   <Form.Label>CVV</Form.Label>
                                   <Form.Control style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}}  type="text" placeholder="Enter CVV" value={formData.cvv} onChange={handleInputChange} />
                               </Form.Group>
                           </div>
                           <div className='row col-4'>
                               <InputGroup className='mb-0' size='lg'>
                                   <InputGroup.Text style={{ cursor: 'pointer', backgroundColor: '#131722' , border: 'none' }} >$</InputGroup.Text>
                                   <Form.Control style={{backgroundColor: 'rgba(243, 243, 243, 0.04)', border: 'none'}}  aria-label='Amount (to the nearest dollar)' placeholder='Enter Amount' onChange={(e) => setAmount(e.target.value)} value={amount} />
                               </InputGroup>
                           </div>
                       </Form>
                       <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} className='p-4'>
                           <button className='btn btn-primary' onClick={handleCardPay}>Continue</button>
                       </div>
                   </React.Fragment>
               )}

           </div>
       </div>
   );
};

export default Deposit;