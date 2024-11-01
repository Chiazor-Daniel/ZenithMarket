import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetPaymentDetailsQuery } from '../../../redux-contexts/redux/services/paymentDetails';
import { useWithdrawMutation } from '../../../redux-contexts/redux/services/transactions';
import ReactDOMServer from 'react-dom/server';
import Swal from 'sweetalert2';
import { RingLoader } from 'react-spinners';

const useWithdraw = (fetchDataAndDispatch) => {
    const [activeButton, setActiveButton] = useState(1);
    const [cardFormData, setcardFormData] = useState({
        card: {
            cardNumber: '',
            cardHolder: '',
            expiryDate: '',
            cvv: ''
        }
    });
    const [withdraw, { isLoading: isWithdrawLoading, isError: isWithdrawError, error: withdrawError }] = useWithdrawMutation();
    const [cardType, setCardType] = useState(null);
    const { userInfo, userToken } = useSelector(state => state.auth);
    const { data, isLoading, error } = useGetPaymentDetailsQuery(userToken);
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [cryptoDetails, setCryptoDetails] = useState(data?.data?.crypto_details || null);
    const preferredToken = data?.data?.crypto_details.find(detail => detail.network_chain === selectedNetwork)?.preferred_token;
    const bankDetails = data?.data?.bank_details;
    const [paymentType, setPaymentType] = useState('');
    const [myPreferredToken, setMyPreferredToken] = useState("");
    const [copied, setCopied] = useState(false);
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [amount, setAmount] = useState(null);
    const [withdrawAddress, setWithDrawAddress] = useState('');
    const [bankFormData, setBankFormData] = useState({
        bankName: '',
        accountType: '',
        accountName: '',
        accountNumber: '',
        bic: '',
        iban: '',
        amount: ''
    });

    useEffect(() => console.log(selectedNetwork), [selectedNetwork]);

    const handleButtonClick = (index) => {
        setActiveButton(index);
        let newPaymentType = '';
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

    const onCryptoWithdraw = async () => {
        const result = await Swal.fire({
            title: 'Confirm Withdrawal',
            text: 'Are you sure you want to make this withdrawal?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, make withdrawal'
        });

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

                const response = await withdraw({
                    amount: parseInt(amount),
                    type: "crypto",
                    wallet_address: withdrawAddress,
                    network_chain: selectedNetwork,
                    user_id: userInfo.id,
                    preferred_token: myPreferredToken,
                    token: userToken
                });

                setTimeout(() => {
                    Swal.close();
                    if (response) {
                        if (Array.isArray(response.data) && response.data.length > 1 && response.data[1]?.data?.status === "success") {
                          fetchDataAndDispatch();
                          Swal.fire({
                            title: "Withdrawal Successful",
                            text: `Your withdrawal has been successfully submitted!`,
                            icon: "success",
                          });
                        } else {
                          if (Array.isArray(response.data) && response.data[1]?.data?.message) {
                            Swal.fire({
                              title: "Error",
                              text: response.data[1]?.data?.message,
                              icon: "error",
                            });
                          } else {
                            Swal.fire({
                              title: "Error",
                              text: "An Error Occured. Please try again",
                              icon: "error",
                            });
                          }
                        }
                      }
                }, 3000);
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
        const field = id.split('-')[0];

        if (field === 'cardNumber' && value.length <= 15) {
            const firstDigit = value.charAt(0);
            if (firstDigit === '5') {
                setCardType('mastercard');
            } else if (firstDigit === '4') {
                setCardType('visa');
            } else {
                setCardType(null);
            }
        }

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
            }, 1000);
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

        if (confirmation.isConfirmed) {
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
                   amount: parseInt(amount),
                    type: "card-payment",
                    card_number: cardFormData.card.cardNumber,
                    expiry_date: expMonth + '/' + expYear,
                    cvv: cardFormData.card.cvv,
                    token: userToken,
                    user_id: userInfo.id,
                });

                const status = response.data[1]?.data?.status;

                console.log("Withdrawal status:", status);
                console.log("card", cardFormData);
                if (status === "success") {
                    fetchDataAndDispatch();
                    setTimeout(() => {
                        loadingToast.close();
                        Swal.fire({
                            title: "Withdrawal Submitted",
                            text: "Your withdrawal has been successfully processed!",
                            icon: "success",
                        });
                    }, 3000);
                } else {
                    loadingToast.close();
                    console.log(response.data[1].data.message)
                    Swal.fire({
                        title: "Error",
                        text: response.data[1].data.message,
                        icon: "error",
                    });
                }
            } catch (error) {
                loadingToast.close();
                console.error("Error occurred during withdrawal:", error);
                Swal.fire({
                    title: "Error",
                    text: "An error occurred during withdrawal. Please try again later.",
                    icon: "error",
                });
            }
        }
    };
    const handleBankChange = (e) => {
        const { name, value } = e.target;
        setBankFormData({
            ...bankFormData,
            [name]: value
        });
    };
    const handleBankSubmit = async () => {
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
        if (confirmation.isConfirmed) {
            try {
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
                            amount:parseInt(amount),
                            type: "bank-transfer",
                            bank_name: bankFormData.bankName,
                            account_name: bankFormData.accountName,
                            iban: bankFormData.iban,
                            bic: bankFormData.bic,
                            user_id: userInfo.id,
                            token: userToken
                        });

                        loadingToast.close();

                        const status = response.data[1]?.data?.status;

                        console.log("Withdrawal status:", status);

                        if (response.data[1]?.data?.status === "success") {
                            fetchDataAndDispatch();
                            Swal.fire({
                                title: "Withdrawal Submitted",
                                text: "Your withdrawal has been successfully submitted!",
                                icon: "success",
                            });
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: response.data[1]?.data?.message ? response.data[1]?.data?.message : "An Error Occurred",
                                icon: "error",
                            });
                        }
                    } catch (error) {
                        console.error("Error occurred during withdrawal:", error);
                        Swal.fire({
                            title: "Error",
                            text: "An error occurred during withdrawal. Please try again later.",
                            icon: "error",
                        });
                    }
                }, 3000);
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
    return {
        activeButton,
        cardFormData,
        setcardFormData,
        isWithdrawLoading,
        isWithdrawError,
        withdrawError,
        cardType,
        data,
        isLoading,
        error,
        selectedNetwork,
        setSelectedNetwork,
        cryptoDetails,
        preferredToken,
        bankDetails,
        paymentType,
        myPreferredToken,
        setMyPreferredToken,
        copied,
        setCopied,
        expMonth,
        setExpMonth,
        expYear,
        setExpYear,
        amount,
        setAmount,
        withdrawAddress,
        setWithDrawAddress,
        bankFormData,
        setBankFormData,
        handleButtonClick,
        onCryptoWithdraw,
        handleInputChange,
        userInfo,
        handleWalletAddressCopy,
        handleCardPayment,
        handleBankChange,
        handleBankSubmit
    };
};
export default useWithdraw;
