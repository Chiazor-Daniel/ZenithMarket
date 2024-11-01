/* eslint-disable */
import React, { useState } from 'react';
import { AiFillBank } from 'react-icons/ai';
import { HiBanknotes } from 'react-icons/hi2';
import { FaCoins } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { SiMastercard } from "react-icons/si";
import { MdError } from "react-icons/md";
import { FaCcVisa } from "react-icons/fa";
import { FaPaste } from "react-icons/fa6";
import { MdReportGmailerrorred } from "react-icons/md";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useEffect } from 'react';
import { MdRunningWithErrors } from "react-icons/md";
import swal from 'sweetalert';
import { useSelector } from 'react-redux';
import { useGetPaymentDetailsQuery } from '../../../redux-contexts/redux/services/paymentDetails';
import { useWithdrawMutation } from '../../../redux-contexts/redux/services/transactions';
import { RingLoader } from "react-spinners";
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';

const buttons = [
    { icon: <AiFillBank size={25} />, text: 'Bank transfer' },
    { icon: <FaCoins size={25} />, text: 'Crypto' },
    { icon: <HiBanknotes size={25} />, text: 'Card payment' }
];


const Withdraw = ({fetchDataAndDispatch}) => {
    const [activeButton, setActiveButton] = useState(1);
    const [cardFormData, setcardFormData] = useState({
        card: {
            cardNumber: "",
            cardHolder: "",
            expiryDate: "",
            cvv: ""
        }
    });
    const [withdraw, { isLoading: isWithdrawLoadin, isError: isWithdrawError, error: withdrawError }] = useWithdrawMutation();
    const [cardType, setCardType] = useState(null);
    const { userToken } = useSelector(state => state.auth);
    const { data, isLoading, error } = useGetPaymentDetailsQuery(userToken)
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [cryptoDetails, setCryptoDetails] = useState(data?.data?.crypto_details || null);
    const preferredToken = data?.data?.crypto_details.find(detail => detail.network_chain === selectedNetwork)?.preferred_token;
    const bankDetails = data?.data?.bank_details;
    const [paymentType, setPaymentType] = useState('');
    const [myPreferredToken, setMyPreferredToken] = useState("")
    const [copied, setCopied] = useState(false)
    const [expMonth, setExpMonth] = useState("")
    const [expYear, setExpYear] = useState("")
    const [amount, setAmount] = useState(null);
    const [withdrawAddress, setWithDrawAddress] = useState("")
    useEffect(() => console.log(selectedNetwork), [])
    const handleButtonClick = (index) => {
        setActiveButton(index);
        let newPaymentType = "";
        switch (index) {
            case 0:
                newPaymentType = 'bank-payment';
                break;
            case 1:
                newPaymentType = 'crypto-payment';
                break;
            case 2:
                newPaymentType = 'card-payment';
                break;
            default:
                break;
        }
        setPaymentType(newPaymentType);
        // alert(newPaymentType);
    };
    const onCryptoWithdraw = async () => {
        // Display confirmation prompt before processing withdrawal
        const result = await Swal.fire({
            title: 'Confirm Withdrawal',
            text: 'Are you sure you want to make this withdrawal?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, make withdrawal'
        });
    
        // If user confirms the withdrawal
        if (result.isConfirmed) {
            try {
                const loadingElement = ReactDOMServer.renderToString(
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                        <RingLoader color="#36d7b7" size={100} />
                        <p>Processing Withdrawal...</p>
                    </div>
                );
    
                Swal.fire({
                    title: '',
                    html: loadingElement,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: false,
                });
                console.log({
                    amount: 100,
                    type: "cryptocurrency",
                    wallet_address: withdrawAddress,
                    network_chain: selectedNetwork,
                    preferred_token: myPreferredToken,
                    token: userToken
                })
    
                const response = await withdraw({
                    amount: 100,
                    type: "cryptocurrency",
                    wallet_address: withdrawAddress,
                    network_chain: selectedNetwork,
                    preferred_token: myPreferredToken,
                    token: userToken
                });
    
                // Delay closing the loading spinner for 3 seconds
                setTimeout(() => {
                    Swal.close();
    
                    const status = response.data[1]?.data?.status;
    
                    if (status === "success") {
                        fetchDataAndDispatch();
                        Swal.fire({
                            title: "Withdrawal Successful",
                            text: `Your withdrawal has been successfully submitted!`,
                            icon: "success",
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: response.data[1]?.data?.message,
                            icon: "error",
                        });
                    }
                }, 3000); // 3000 milliseconds (3 seconds)
            } catch (error) {
                console.error("Error occurred during withdrawal:", error);
                Swal.fire({
                    title: "Error",
                    text: "An error occurred during withdrawal. Please try again later.",
                    icon: "error",
                });
            }
        }
    };
    


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const field = id.split('-')[0]; // Extract the field name from the controlId

        if (field === 'cardNumber' && value.length <= 15) {
            // Card type detection logic
            const firstDigit = value.charAt(0);
            if (firstDigit === '5') {
                setCardType('mastercard');
            } else if (firstDigit === '4') {
                setCardType('visa');
            } else {
                setCardType(null);
            }
        }

        // Update the state based on the field name
        setcardFormData(prevState => ({
            ...prevState,
            card: {
                ...prevState.card,
                [field]: value
            }
        }));
    };


    const handleWalletAddressCopy = () => {
        navigator.clipboard.writeText(cardFormData.walletAddress).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1000); // Reset copied state after 3 seconds
        }).catch((error) => {
            console.error('Failed to copy: ', error);
        });
    };

    useEffect(() => {
        if (expMonth && expYear) {
            setcardFormData(prevState => ({
                ...prevState,
                card: {
                    ...prevState.card,
                    expiryDate: expMonth + '/' + expYear
                }
            }));
        }
    }, [expMonth, expYear]);


    const handleCardPayment = async () => {
        // Display confirmation prompt before processing withdrawal
        const confirmation = await Swal.fire({
            title: 'Confirm Card Payment',
            text: 'Are you sure you want to submit this card payment withdrawal request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, submit it!',
            cancelButtonText: 'Cancel'
        });
    
        // If user confirms the withdrawal
        if (confirmation.isConfirmed) {
            // Display loading spinner while processing withdrawal
            const loadingElement = ReactDOMServer.renderToString(
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                    <RingLoader color="#36d7b7" size={100} />
                    <p>Processing Withdrawal...</p>
                </div>
            );
        
            const loadingToast = Swal.fire({
                title: '',
                html: loadingElement,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCloseButton: false,
            });
        
            try {
                const response = await withdraw({
                    amount: amount,
                    type: "card-payment",
                    card_number: cardFormData.card.cardNumber,
                    expiry_date: expMonth + '/' + expYear,
                    cvv: cardFormData.card.cvv,
                    token: userToken
                });
        
                // Extracting the status from the response
                const status = response.data[1]?.data?.status;
        
                console.log("Withdrawal status:", status);
                console.log("card", cardFormData);
        
                if (status === "success") {
                    fetchDataAndDispatch();
                    // Delay closing the loading spinner for 3 seconds
                    setTimeout(() => {
                        // Close loading spinner
                        loadingToast.close();
        
                        // Custom Swal.fire for success
                        Swal.fire({
                            title: "Withdrawal Submitted",
                            text: "Your withdrawal has been successfully processed!",
                            icon: "success",
                        });
                    }, 3000); // 3000 milliseconds (3 seconds)
                } else {
                    // Close loading spinner
                    loadingToast.close();
                    console.log(response.data[1].data.message)
                    Swal.fire({
                        title: "Error",
                        text: response.data[1].data.message,
                        icon: "error",
                    });
                }
            } catch (error) {
                // Close loading spinner
                loadingToast.close();
        
                console.error("Error occurred during withdrawal:", error);
                // Handle error, such as displaying an error message to the user
                Swal.fire({
                    title: "Error",
                    text: "An error occurred during withdrawal. Please try again later.",
                    icon: "error",
                });
            }
        }
    };
    
    
    const [bankFormData, setBankFormData] = useState({
        bankName: '',
        accountType: '',
        accountName: '',
        accountNumber: '',
        bic: '',
        iban: '',
        amount: ''
    });


    const handleBankChange = (e) => {
        const { name, value } = e.target;
        setBankFormData({
            ...bankFormData,
            [name]: value
        });
    };

    const handleBankSubmit = async () => {
        // Display confirmation prompt before processing withdrawal
        const confirmation = await Swal.fire({
            title: 'Confirm Withdrawal',
            text: 'Are you sure you want to submit this withdrawal request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, submit it!',
            cancelButtonText: 'Cancel'
        });
    
        // If user confirms the withdrawal
        if (confirmation.isConfirmed) {
            try {
                // Display loading spinner while processing withdrawal
                const loadingElement = ReactDOMServer.renderToString(
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                        <RingLoader color="#36d7b7" size={100} />
                        <p>Processing Withdrawal...</p>
                    </div>
                );
    
                const loadingToast = Swal.fire({
                    title: '',
                    html: loadingElement,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showCloseButton: false,
                });
    
                setTimeout(async () => {
                    try {
                        const response = await withdraw({
                            amount: bankFormData.amount,
                            type: "bank-transfer",
                            bank_name: bankFormData.bankName,
                            account_name: bankFormData.accountName,
                            iban: bankFormData.iban,
                            bic: bankFormData.bic,
                            token: userToken
                        });
    
                        // Close loading spinner
                        loadingToast.close();
    
                        const status = response.data[1]?.data?.status;
    
                        console.log("Withdrawal status:", status);
    
                        if (status === "success") {
                            fetchDataAndDispatch();
                            // Display success message
                            Swal.fire({
                                title: "Withdrawal Submitted",
                                text: "Your withdrawal has been successfully submitted!",
                                icon: "success",
                            });
                        } else {
                            // Display error message
                            Swal.fire({
                                title: "Error",
                                text: response.data[1]?.data?.message ? response.data[1]?.data?.message : "An Error Occurred",
                                icon: "error",
                            });
                        }
                    } catch (error) {
                        console.error("Error occurred during withdrawal:", error);
                        // Display error message
                        Swal.fire({
                            title: "Error",
                            text: "An error occurred during withdrawal. Please try again later.",
                            icon: "error",
                        });
                    }
                }, 3000);
            } catch (error) {
                console.error("Error occurred during withdrawal:", error);
                // Display error message
                Swal.fire({
                    title: "Error",
                    text: "An error occurred during withdrawal. Please try again later.",
                    icon: "error",
                });
            }
        }
    };
    
    
    return (
        <div className='row p-4' style={{ display: 'flex', gap: '30px', height: 'auto' }}>
            <div className='card col-lg-2 p-4' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '500px' }}>
                {buttons.map((button, index) => (
                    <button
                        key={index}
                        className={`btn btn-primary p-4 ${activeButton === index ? 'active' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                        onClick={() => handleButtonClick(index)}
                    >
                        {button.icon}
                        <span>{button.text}</span>
                    </button>
                ))}
            </div>
            <div className='card col-lg-9 p-4' style={{ height: '100%' }}>
                <h1>Withdraw via <span>{buttons[activeButton]?.text}</span></h1>
                {activeButton === 0 && (
                    <p style={{ display: "flex", alignItems: "center" }}> <MdReportGmailerrorred color='#DC6B19' />
                        <span style={{ fontStyle: "italic" }}>
                            Warning: Bank account accepted is only accounts with the name you registered with.
                        </span>
                    </p>
                )
                }
                {activeButton === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                            <p>Bank Name: </p>
                            <InputGroup className='mb-0' size='lg'>
                                <Form.Control
                                    aria-label='Amount (to the nearest dollar)'
                                    placeholder='Enter Bank Name'
                                    name='bankName'
                                    value={bankFormData.bankName}
                                    onChange={handleBankChange}
                                    disabled={false}
                                />
                            </InputGroup>
                        </div>
                        <div>
                            <p>Select Account Type: </p>
                            <Form.Select size='lg' name='accountType' defaultValue={bankFormData.accountType} onChange={handleBankChange}>
                                <option>Fixed deposit account</option>
                                <option>Saving account</option>
                                <option>Current account</option>
                                <option>Checkings account</option>
                            </Form.Select>
                        </div>
                        <div>
                            <p>Account Name: </p>
                            <InputGroup className='mb-0' size='lg'>
                                <Form.Control
                                    aria-label='Amount (to the nearest dollar)'
                                    placeholder='Enter Account Name'
                                    name='accountName'
                                    value={bankFormData.accountName}
                                    onChange={handleBankChange}
                                    disabled={false}
                                />
                            </InputGroup>
                        </div>
                        <div>
                            <p>Enter Account Number: </p>
                            <InputGroup className='mb-0' size='lg'>
                                <Form.Control
                                    aria-label='Amount (to the nearest dollar)'
                                    placeholder='Enter Account Number'
                                    name='accountNumber'
                                    value={bankFormData.accountNumber}
                                    onChange={handleBankChange}
                                />
                                <InputGroup.Text style={{ cursor: 'pointer' }} ><FaPaste /></InputGroup.Text>
                            </InputGroup>
                        </div>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <p>BIC: </p>
                                <InputGroup className='mb-0' size='lg'>
                                    <Form.Control
                                        aria-label='Amount (to the nearest dollar)'
                                        placeholder='Enter BIC'
                                        name='bic'
                                        value={bankFormData.bic}
                                        onChange={handleBankChange}
                                        disabled={false}
                                    />
                                </InputGroup>
                            </div>
                            <div className='col-lg-6'>
                                <p>IBAN: </p>
                                <InputGroup className='mb-0' size='lg'>
                                    <Form.Control
                                        aria-label='Amount (to the nearest dollar)'
                                        placeholder='Enter IBAN'
                                        name='iban'
                                        value={bankFormData.iban}
                                        onChange={handleBankChange}
                                        disabled={false}
                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <div className='col-4'>
                            <p>Amount: </p>
                            <InputGroup className='mb-0' size='lg'>
                                <InputGroup.Text style={{ cursor: 'pointer' }} >$</InputGroup.Text>
                                <Form.Control
                                    aria-label='Amount (to the nearest dollar)'
                                    placeholder='Enter Amount'
                                    name='amount'
                                    value={bankFormData.amount}
                                    onChange={handleBankChange}
                                />
                            </InputGroup>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} className='p-4'>
                            <button className='btn btn-primary' onClick={handleBankSubmit}>Request Withdrawal</button>
                        </div>
                    </div>
                )}
                {activeButton === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                      <p>Network Chain</p>
                      <Form.Select size='lg' onChange={(e)=>setSelectedNetwork(e.target.value)}>
                          <option value="" disabled selected>Select Network</option>
                              <option value="ETH">ETH</option>
                              <option value="BTC">BTC</option>
                              <option value="USDT">USDT</option>
                      </Form.Select>
                  </div>
                  <div>
                      <p>Preferred Token:</p>
                      <Form.Control
                          aria-label='Wallet Address'
                          placeholder='Preferred Token'
                          value={preferredToken}
                          onChange={(e)=>setMyPreferredToken(e.target.value)}
                      />
                  </div>
                      <div>
                          <p>Wallet Address:</p>
                          <InputGroup className='mb-3' size='lg'>
                              <Form.Control
                                  aria-label='Wallet Address'
                                  placeholder='Wallet Address'
                                  value={withdrawAddress}
                                  onChange={(e) => setWithDrawAddress(e.target.value)}
                              />
                              <OverlayTrigger
                                  trigger={['hover', 'focus']}
                                  placement="top"
                                  overlay={
                                      <Tooltip id={`tooltip-top`}>
                                          Paste Address
                                      </Tooltip>
                                  }
                              >
                                  <InputGroup.Text style={{ cursor: 'pointer' }} onClick={() => alert("pasted")}>
                                      <FaPaste />
                                  </InputGroup.Text>
                              </OverlayTrigger>
                          </InputGroup>
                      </div>
                  <div className='col-4'>
                      <p>Amount: </p>
                      <InputGroup className='mb-0' size='lg'>
                          <InputGroup.Text style={{ cursor: 'pointer' }} >$</InputGroup.Text>
                          <Form.Control
                              aria-label='Amount (to the nearest dollar)'
                              placeholder='Enter Amount'
                              name='amount'
                              value={bankFormData.amount}
                              onChange={handleBankChange}
                          />
                      </InputGroup>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} className='p-4' >
                      <button className='btn btn-primary' onClick={() => onCryptoWithdraw()}>Make Withdrawal</button>
                  </div>
              </div> 
                ) 
                }
                {activeButton === 2 && (
                    <>
                        <Form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Form.Group controlId="cardHolder">
                                <Form.Label> Card Holder Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter card holder name" value={cardFormData.card.cardHolder} onChange={handleInputChange} />
                            </Form.Group>
                            <Form.Group controlId="cardNumber">
                                <Form.Label>Card Number</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1">
                                        {!cardFormData.cardNumber?.length <= 15 ? (
                                            cardType === 'mastercard' ? <SiMastercard size={20} /> :
                                                cardType === 'visa' ? <FaCcVisa size={20} /> :
                                                    <MdError size={20} color='#E72929' />
                                        ) : <MdError size={20} color='#E72929' />}
                                    </InputGroup.Text>
                                    <Form.Control type="text" placeholder="Enter credit card number" value={cardFormData.card.cardNumber} onChange={handleInputChange} />
                                </InputGroup>
                                <p>
                                    {!cardFormData?.cardNumber?.length <= 15 ? (
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
                                            <Form.Control type="text" placeholder="MM" value={expMonth} onChange={(e) => setExpMonth(e.target.value)} />
                                        </Form.Group>
                                        <span className='col-lg-1'>/</span>
                                        <Form.Group controlId="expiryYear" className='col-lg-4'>
                                            <Form.Control type="text" placeholder="YY" value={expYear} onChange={(e) => setExpYear(e.target.value)} />
                                        </Form.Group>
                                    </div>
                                </Form.Group>

                                <Form.Group controlId="cvv" className='col-lg-4'>
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control type="text" placeholder="Enter CVV" value={cardFormData?.cvv} onChange={handleInputChange} />
                                </Form.Group>
                            </div>
                            <Form.Group controlId="cvv" className='col-lg-4 mt-4'>
                                <Form.Label>Amount</Form.Label>
                                <InputGroup className='mb-0' size='lg'>
                                    <InputGroup.Text style={{ cursor: 'pointer' }} >$</InputGroup.Text>
                                    <Form.Control aria-label='Amount (to the nearest dollar)' placeholder='Enter Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                        </Form>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} className='p-4'>
                            <button className='btn btn-primary' onClick={handleCardPayment}>Continue</button>


                        </div>
                    </>
                )
                }


            </div>
        </div >
    );
};

export default Withdraw;
