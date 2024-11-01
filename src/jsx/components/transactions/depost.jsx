/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { AiFillBank } from 'react-icons/ai';
import { HiBanknotes } from 'react-icons/hi2';
import { FaCoins, FaCopy } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { SiMastercard } from "react-icons/si";
import { FaCcVisa } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useGetPaymentDetailsQuery } from '../../../redux-contexts/redux/services/paymentDetails';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { MdRunningWithErrors } from "react-icons/md";
import ReactDOMServer from 'react-dom/server';
import RingLoader from 'react-spinners/RingLoader';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { useDepositMutation } from '../../../redux-contexts/redux/services/transactions';
import { PiBankFill } from "react-icons/pi";

const buttons = [
    { icon: <AiFillBank size={25} />, text: 'Bank transfer' },
    { icon: <FaCoins size={25} />, text: 'Crypto' },
    { icon: <HiBanknotes size={25} />, text: 'Card payment' }
];

const Deposit = ({fetchDataAndDispatch }) => {
    const [activeButton, setActiveButton] = useState(1);
    const { userToken } = useSelector(state => state.auth);
    const { data, isLoading, error, refetch } = useGetPaymentDetailsQuery(userToken)
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
    });
    const [cardType, setCardType] = useState("");
    const [cryptoDetails, setCryptoDetails] = useState(data?.data?.crypto_details);
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [amount, setAmount] = useState(0)
    const [cryptoForm, setCryptoForm] = useState({
        amount: amount,
        type: "crypto"
    })
    const [preferredToken, setPreferredToken] = useState("")
    const [bankDetails, setBankDetails] = useState("")
    const [paymentType, setPaymentType] = useState('');
    const [copied, setCopied] = useState(false)
    useEffect(() => {
        console.log(cryptoDetails)
        if (!data && !isLoading && !error) {
            refetch();
        } else if (data) {
            setCryptoDetails(data?.data?.crypto_details);
            const preferredToken = data?.data?.crypto_details.find(detail => detail.network_chain === selectedNetwork)?.preferred_token;
            setPreferredToken(preferredToken);
            setBankDetails(data?.data?.bank_details);
        }
    }, [data, isLoading, error, selectedNetwork]);


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


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Check the card type based on the first digit of the card number
        if (id === 'cardNumber' && value.length <= 15) {
            const firstDigit = value.charAt(0);
            if (firstDigit === '5') {
                setCardType('mastercard');
            } else if (firstDigit === '4') {
                setCardType('visa');
            } else {
                setCardType(null); // Invalid card number
            }
        }
    };

    const handleNetworkChange = (event) => {
        const selectedNetwork = event.target.value;
        setSelectedNetwork(selectedNetwork);
        const selectedCryptoDetail = data?.data?.crypto_details.find(detail => detail.network_chain === selectedNetwork);
        if (selectedCryptoDetail) {
            setFormData(prevState => ({
                ...prevState,
                walletAddress: selectedCryptoDetail.wallet_address
            }));
        }
    };

    const handleWalletAddressCopy = () => {
        navigator.clipboard.writeText(formData.walletAddress).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 1000); // Reset copied state after 3 seconds
        }).catch((error) => {
            console.error('Failed to copy: ', error);
        });
    };

    const [deposit, { isDespoitError, depositErro }] = useDepositMutation()
    const handleCryptoDeposit = async () => {
        console.log("amount", amount)
        try {
            const result = await Swal.fire({
                title: 'Confirm Deposit',
                text: `Are you sure you want to deposit $${amount} via Crypto?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed) {
                // Proceed with deposit
                // Render loading element
                const loadingElement = ReactDOMServer.renderToString(
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                        <RingLoader color="#36d7b7" size={100} />
                        <p>Processing Deposit...</p>
                    </div>
                );

                // Show loading dialog
                const loadingToast = Swal.fire({
                    title: '',
                    html: loadingElement,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });

                // Simulate deposit processing
                setTimeout(async () => {
                    try {
                        // Call deposit API with appropriate data
                        const response = await deposit({
                            amount: amount, // Adjust as needed
                            type: cryptoForm.type, // Adjust as needed
                            token: userToken
                        });

                        // Close loading dialog
                        Swal.close();

                        // Handle deposit response
                        const status = response.data[0]?.status;
                        console.log("Deposit status:", status);

                        if (status === "success") {
                            // Show success message
                            fetchDataAndDispatch()
                            Swal.fire({
                                title: "Deposit Pending",
                                text: "Await deposit approval!",
                                icon: "info",
                            });
                        } else{
                            Swal.fire({
                                title: "Error",
                                text: response.data[1]?.data,
                                icon: "error",
                            });
                        }
                    } catch (error) {
                        // Close loading dialog
                        Swal.close();

                        // Handle deposit error
                        console.error("Error occurred during deposit:", error);
                        Swal.fire({
                            title: "Error",
                            text: "An error occurred during deposit. Please try again later.",
                            icon: "error",
                        });
                    }
                }, 3000); // Simulated deposit processing time
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error("Error occurred during deposit:", error);
            Swal.fire({
                title: "Error",
                text: "An unexpected error occurred during deposit. Please try again later.",
                icon: "error",
            });
        }
    };
    const handleBankPayment = async () => {
        try {
            const result = await Swal.fire({
                title: 'Confirm Deposit',
                text: `Are you sure you want to deposit $${amount} via Bank Transfer?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed) {
                // Proceed with deposit
                const loadingElement = ReactDOMServer.renderToString(
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                        <RingLoader color="#36d7b7" size={100} />
                        <p>Processing Deposit...</p>
                    </div>
                );

                const loadingToast = Swal.fire({
                    title: '',
                    html: loadingElement,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });

                // Simulate deposit processing
                setTimeout(async () => {
                    try {
                        // Call deposit API with appropriate data
                        const response = await deposit({
                            amount: amount, // Adjust as needed
                            type: "bank-transfer", // Adjust as needed
                            token: userToken
                        });

                        // Close loading dialog
                        Swal.close();

                        // Handle deposit response
                        const status = response.data[0]?.status;
                        console.log("Deposit status:", status);

                        if (status === "success") {
                            fetchDataAndDispatch()
                            // Show success message
                            Swal.fire({
                                title: "Deposit Pending",
                                text: "Await deposit approval!",
                                icon: "info",
                            });
                        }else{
                            Swal.fire({
                                title: "Error",
                                text: response.data[1]?.data,
                                icon: "error",
                            });
                        }
                    } catch (error) {
                        // Close loading dialog
                        Swal.close();

                        // Handle deposit error
                        console.error("Error occurred during deposit:", error);
                        Swal.fire({
                            title: "Error",
                            text: "An error occurred during deposit. Please try again later.",
                            icon: "error",
                        });
                    }
                }, 3000); // Simulated deposit processing time
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error("Error occurred during deposit:", error);
            Swal.fire({
                title: "Error",
                text: "An unexpected error occurred during deposit. Please try again later.",
                icon: "error",
            });
        }
    };
    const handleCardPay = async () => {
        try {
            const result = await Swal.fire({
                title: 'Confirm Deposit',
                text: `Are you sure you want to deposit $${amount} via Card Payment?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed) {
                // Proceed with deposit
                const loadingElement = ReactDOMServer.renderToString(
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                        <RingLoader color="#36d7b7" size={100} />
                        <p>Processing Deposit...</p>
                    </div>
                );

                const loadingToast = Swal.fire({
                    title: '',
                    html: loadingElement,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });

                // Simulate deposit processing
                setTimeout(async () => {
                    try {
                        // Call deposit API with appropriate data
                        const response = await deposit({
                            amount: amount, // Adjust as needed
                            type: "card-payment", // Adjust as needed
                            token: userToken,
                            cardData: formData
                        });

                        // Close loading dialog
                        Swal.close();

                        // Handle deposit response
                        const status = response.data[0]?.status;
                        console.log("Deposit status:", status);

                        if (status === "success") {
                            fetchDataAndDispatch()

                            // Show success message
                            Swal.fire({
                                title: "Deposit Pending",
                                text: "Await deposit approval!",
                                icon: "info",
                            });
                        }else{
                            Swal.fire({
                                title: "Error",
                                text: response.data[1]?.data,
                                icon: "error",
                            });
                        }
                    } catch (error) {
                        // Close loading dialog
                        Swal.close();

                        // Handle deposit error
                        console.error("Error occurred during deposit:", error);
                        Swal.fire({
                            title: "Error",
                            text: "An error occurred during deposit. Please try again later.",
                            icon: "error",
                        });
                    }
                }, 3000); // Simulated deposit processing time
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error("Error occurred during deposit:", error);
            Swal.fire({
                title: "Error",
                text: "An unexpected error occurred during deposit. Please try again later.",
                icon: "error",
            });
        }
    };
    useEffect(() => console.log(data), [])
    const[withdrawBank, setWithdrawbank] = useState("")
    console.log(data?.data.crypto_details)
    return (
        <div className='row p-4' style={{ display: 'flex', gap: '30px', height: 'auto' }}>
            {/* <ExampleComponent /> */}
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
                <h1>Deposit via <span>{buttons[activeButton]?.text}</span></h1>
                {
                    activeButton === 1 ? (
                        !isLoading && cryptoDetails?.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <p>Network Chain</p>
                                    <Form.Select size='lg' onChange={handleNetworkChange}>
                                        <option value="" disabled selected>Select Network</option>
                                        {cryptoDetails && data?.data?.crypto_details.map(detail => (
                                            <option key={detail.id} value={detail.network_chain}>{detail.network_chain}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                                <div>
                                    <p>Preferred Token:</p>
                                    <Form.Control
                                        aria-label='Wallet Address'
                                        placeholder='Preferred Token'
                                        value={preferredToken}
                                        readOnly
                                    />
                                </div>

                                {cryptoDetails && (
                                    <div>
                                        <p>Wallet Address:</p>
                                        <InputGroup className='mb-3' size='lg'>
                                            <Form.Control
                                                aria-label='Wallet Address'
                                                placeholder='Wallet Address'
                                                value={formData.walletAddress}
                                                readOnly
                                            />
                                            <OverlayTrigger
                                                trigger={['hover', 'focus']}
                                                placement="top"
                                                overlay={
                                                    <Tooltip id={`tooltip-top`}>
                                                        {copied ? "Copied" : "Copy"} to Clipboard
                                                    </Tooltip>
                                                }
                                            >
                                                <InputGroup.Text style={{ cursor: 'pointer' }} onClick={handleWalletAddressCopy}>
                                                    <FaCopy />
                                                </InputGroup.Text>
                                            </OverlayTrigger>
                                        </InputGroup>
                                    </div>
                                )}
                                <div className='row col-4'>
                                    <InputGroup className='mb-0' size='lg'>
                                        <InputGroup.Text style={{ cursor: 'pointer' }} >$</InputGroup.Text>
                                        <Form.Control aria-label='Amount (to the nearest dollar)' placeholder='Enter Amount' value={amount} onChange={(e)=>setAmount(e.target.value)}/>
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
                    ) : null
                }
                {activeButton === 0 ? (
                    bankDetails?.length > 0 || Array.isArray(bankDetails)? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div className='row'>
                                {Array.isArray(bankDetails) && bankDetails?.map((detail, index) => (
                                    <div key={index} style={{ fontSize: "1.2rem", margin: "10px", padding: "10px", cursor: "pointer" }} className='card col-5' onClick={()=>setWithdrawbank(detail.iban)}>
                                        <div style={{position: "absolute", right: 0, top: 0}}>
                                            <PiBankFill color='green' size={30}/>
                                        </div>
                                        <p>Bank Name: {detail.bank_name}</p>
                                        <p>Account Name: {detail.account_name}</p>
                                        <p>IBAN: {detail.iban}</p>
                                        <p>BIC: {detail.bic}</p>
                                    </div>
                                ))}
                            </div>
                            {
                                Array.isArray(bankDetails) && (
                                <div className='row'>
                                    <div className='col-4'>
                                        <p style={{ fontSize: "1.2rem" }}>Bank Account IBAN: </p>
                                        <InputGroup className='mb-0' size='lg'>
                                            <InputGroup.Text style={{ cursor: 'pointer' }} ><FaCopy /></InputGroup.Text>
                                            <Form.Control aria-label='Bank Account Number' placeholder={withdrawBank} readOnly />
                                        </InputGroup>
                                    </div>
                                    <div className='col-4'>
                                        <p style={{ fontSize: "1.2rem" }}>Amount: </p>
                                        <InputGroup className='mb-0' size='lg'>
                                            <InputGroup.Text style={{ cursor: 'pointer' }} >$</InputGroup.Text>
                                            <Form.Control aria-label='Amount (to the nearest dollar)' placeholder='Enter Amount' value={amount} onChange={(e)=>setAmount(e.target.value)} />
                                        </InputGroup>
                                    </div>
                                </div>
                                )
                            }
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} className='p-4'>
                                <button className='btn btn-primary' onClick={handleBankPayment}>Make Deposit</button>
                            </div>
                        </div>) : (
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
                                <Form.Control type="text" placeholder="Enter card holder name" value={formData.cardHolder} onChange={handleInputChange} />
                            </Form.Group>
                            {/* <Form.Group controlId="cardHolder" className='row'>
                                <div className='row col-6'>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter card holder name" value={cardFirstname} readOnly/>
                                </div>
                                <div className='row col-6'>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter card holder name" value={cardLastname} readOnly/>
                                </div>
                            </Form.Group> */}
                            <Form.Group controlId="cardNumber">
                                <Form.Label>Card Number</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1">
                                        {formData.cardNumber.length <= 15 ? (
                                            cardType === 'mastercard' ? <SiMastercard size={20} /> :
                                                cardType === 'visa' ? <FaCcVisa size={20} /> :
                                                    <MdError size={20} color='#E72929' />
                                        ) : <MdError size={20} color='#E72929' />}
                                    </InputGroup.Text>
                                    <Form.Control type="text" placeholder="Enter credit card number" value={formData.cardNumber} onChange={handleInputChange} />
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
                                            <Form.Control type="text" placeholder="MM" value={formData.expiryDate.substring(0, 2)} onChange={(e) => handleInputChange({ target: { id: "expiryDate", value: e.target.value + formData.expiryDate.substring(2) } })} />
                                        </Form.Group>
                                        <span className='col-lg-1'>/</span>
                                        <Form.Group controlId="expiryYear" className='col-lg-4'>
                                            <Form.Control type="text" placeholder="YY" value={formData.expiryDate.substring(3)} onChange={(e) => handleInputChange({ target: { id: "expiryDate", value: formData.expiryDate.substring(0, 3) + e.target.value } })} />
                                        </Form.Group>
                                    </div>
                                </Form.Group>
                                <Form.Group controlId="cvv" className='col-lg-4'>
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control type="text" placeholder="Enter CVV" value={formData.cvv} onChange={handleInputChange} />
                                </Form.Group>
                            </div>
                             <div className='row col-4'>
                                    <InputGroup className='mb-0' size='lg'>
                                        <InputGroup.Text style={{ cursor: 'pointer' }} >$</InputGroup.Text>
                                        <Form.Control aria-label='Amount (to the nearest dollar)' placeholder='Enter Amount' onChange={(e)=>setAmount(e.target.value)} value={amount}/>
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
