// src/hooks/useDeposit.js
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDepositMutation } from '../../../redux-contexts/redux/services/transactions';
import { useGetPaymentDetailsQuery } from '../../../redux-contexts/redux/services/paymentDetails';
import Swal from 'sweetalert2';
import ReactDOMServer from 'react-dom/server';
import RingLoader from 'react-spinners/RingLoader';

const useDeposit = () => {
    const [activeButton, setActiveButton] = useState(1);
    const { userToken } = useSelector(state => state.auth);
    const { data, isLoading, error, refetch } = useGetPaymentDetailsQuery(userToken);
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        cvv: "",
    });
    const [cardType, setCardType] = useState("");
    const [cryptoDetails, setCryptoDetails] = useState(data?.data?.crypto_details);
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [amount, setAmount] = useState(0);
    const [cryptoForm, setCryptoForm] = useState({
        amount: amount,
        type: "crypto"
    });
    const [preferredToken, setPreferredToken] = useState("");
    const [bankDetails, setBankDetails] = useState("");
    const [paymentType, setPaymentType] = useState('');
    const [copied, setCopied] = useState(false);
    const [withdrawBank, setWithdrawbank] = useState("");
    const [deposit, { isDepositError, depositError }] = useDepositMutation();

    useEffect(() => {
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
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        if (id === 'cardNumber' && value.length <= 15) {
            const firstDigit = value.charAt(0);
            if (firstDigit === '5') {
                setCardType('mastercard');
            } else if (firstDigit === '4') {
                setCardType('visa');
            } else {
                setCardType(null);
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
            }, 1000);
        }).catch((error) => {
            console.error('Failed to copy: ', error);
        });
    };

    const handleCryptoDeposit = async () => {
        try {
            const result = await Swal.fire({
                title: 'Confirm Deposit',
                text: `Are you sure you want to deposit $${amount} via Crypto?`,
                icon: 'question',
                background: '#131722',
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
            });

            if (result.isConfirmed) {
                const loadingElement = ReactDOMServer.renderToString(
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                        <RingLoader color="#36d7b7" size={200} />
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

                setTimeout(async () => {
                    try {
                        const response = await deposit({
                            amount: amount,
                            type: cryptoForm.type,
                            token: userToken
                        });

                        Swal.close();

                        const status = response.data[0]?.status;
                        if (status === "success") {
                            Swal.fire({
                                title: "Deposit Pending",
                                background: '#131722',
                                text: "Await deposit approval!",
                                icon: "info",
                            });
                        } else {
                            Swal.fire({
                                title: "Error",
                                background: '#131722',
                                text: response.data[1]?.data,
                                icon: "error",
                            });
                        }
                    } catch (error) {
                        Swal.close();
                        Swal.fire({
                            title: "Error",
                            background: '#131722',
                            text: "An error occurred during deposit. Please try again later.",
                            icon: "error",
                        });
                    }
                }, 3000);
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                background: '#131722',
                text: "An unexpected error occurred during deposit. Please try again later.",
                icon: "error",
            });
        }
    };

    // src/hooks/useDeposit.js (continued)
const handleBankPayment = async () => {
    try {
        const result = await Swal.fire({
            title: 'Confirm Deposit',
            background: '#131722',
            text: `Are you sure you want to deposit $${amount} via Bank Transfer?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            const loadingElement = ReactDOMServer.renderToString(
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                    <RingLoader color="#36d7b7" size={200} />
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

            setTimeout(async () => {
                try {
                    const response = await deposit({
                        amount: amount,
                        type: "bank-transfer",
                        token: userToken
                    });

                    Swal.close();

                    const status = response.data[0]?.status;
                    if (status === "success") {
                        Swal.fire({
                            title: "Deposit Pending",
                            text: "Await deposit approval!",
                            background: '#131722',
                            icon: "info",
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: response.data[1]?.data,
                            background: '#131722',
                            icon: "error",
                        });
                    }
                } catch (error) {
                    Swal.close();
                    Swal.fire({
                        title: "Error",
                        background: '#131722',
                        text: "An error occurred during deposit. Please try again later.",
                        icon: "error",
                    });
                }
            }, 3000);
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            background: '#131722',
            text: "An unexpected error occurred during deposit. Please try again later.",
            icon: "error",
        });
    }
};

const handleCardPay = async () => {
    try {
        const result = await Swal.fire({
            title: 'Confirm Deposit',
            background: '#131722',
            text: `Are you sure you want to deposit $${amount} via Card Payment?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            const loadingElement = ReactDOMServer.renderToString(
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", padding: "100px", alignItems: "center" }}>
                    <RingLoader color="#36d7b7" size={200} />
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

            setTimeout(async () => {
                try {
                    const response = await deposit({
                        amount: amount,
                        type: "card-payment",
                        token: userToken,
                        cardData: formData
                    });

                    Swal.close();

                    const status = response.data[0]?.status;
                    if (status === "success") {
                        Swal.fire({
                            title: "Deposit Pending",
                            background: '#131722',
                            text: "Await deposit approval!",
                            icon: "info",
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            background: '#131722',
                            text: response.data[1]?.data,
                            icon: "error",
                        });
                    }
                } catch (error) {
                    Swal.close();
                    Swal.fire({
                        title: "Error",
                        background: '#131722',
                        text: "An error occurred during deposit. Please try again later.",
                        icon: "error",
                    });
                }
            }, 3000);
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            background: '#131722',
            text: "An unexpected error occurred during deposit. Please try again later.",
            icon: "error",
        });
    }
};

return {
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
    setAmount,
    cryptoDetails,
    preferredToken,
    bankDetails,
    paymentType,
};
};

export default useDeposit;