/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import { BankForm, CryptoForm } from './Forms'; // Assuming Forms.js is the file where you've defined BankForm and CryptoForm
import Swal from 'sweetalert2';
import { useCreateBankDetailsMutation } from '../../redux-contexts/redux/services/admin';
import { useSelector } from 'react-redux';
import { useEditCryptoDetailsMutation } from '../../redux-contexts/redux/services/admin';
import { useEditBankDetailsMutation } from '../../redux-contexts/redux/services/admin';
import { useCreateCryptoDetailsMutation } from '../../redux-contexts/redux/services/admin';
const Finance = ({ paymentDetails, token, refetch }) => {
  const [selectedButton, setSelectedButton] = useState('');
  const { adminToken } = useSelector(state => state.adminAuth)
  const[editBankDetails] = useEditBankDetailsMutation();
  const [editCryptoDetails] = useEditCryptoDetailsMutation()
  const [showModal, setShowModal] = useState(false);
  const [bankDetails, setBankDetails] = useState(paymentDetails.bank_details);
  const [editedDetail, setEditedDetail] = useState({
    id: '',
    key: "Less Loved",
    iban: '',
    account_name: '',
    owner: '',
    bank_name: '',
    bic: '',
    reference: ''
  });
  const [createBankDetails, { isLoading: createBankDetailsLoading, error: createBankDetailsError }] = useCreateBankDetailsMutation();
  const [createCryptoDetails] = useCreateCryptoDetailsMutation()
  const [cryptoDetails, setCryptoDetails] = useState(paymentDetails.crypto_details);
  const [editedCryptoDetail, setEditedCryptoDetail] = useState({
    id: '',
    key: "Less Loved",
    wallet_address: '',
    preferred_token: '',
    network_chain: ''
  });

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleButtonClick = (text) => {
    setSelectedButton(text);
  };

  const handleCreateNewBankDetails = () => {
    setEditedDetail({
      key: "Less Loved",
      id: '',
      iban: '',
      account_name: '',
      owner: '',
      bank_name: '',
      bic: '',
      reference: ''
    });
    handleShowModal();
  };
  // useEffect(()=> refetch(), [])

  const handleCreateNewCryptoDetails = () => {
    setEditedCryptoDetail({
      key: 'Less Loved',
      wallet_address: '',
      preferred_token: '',
      network_chain: ''
    });
    handleShowModal();
  };

  const handleSaveCryptoDetails = async (event) => {
    event.preventDefault();
    Swal.fire({
      icon: "warning",
      title: "Create new crypto details",
      text: "creating new crypto details...",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { wallet_address,network_chain, preferred_token, key } = editedCryptoDetail
          const res = await createCryptoDetails({ token: adminToken, wallet_address,network_chain, preferred_token, key })
          console.log(res)
          if (res.data.status === "success") {
            refetch()
            Swal.fire({
              title: "Details created successfully",
              icon: "success",
              confirmButtonColor: '#3085d6',
            })
          } else {
            Swal.fire({
              title: "Details already exists",
              text: "Details already present",
              icon: "info",
              confirmButtonColor: '#3085d6',
            })
          }
        } catch (err) {
          console.log(err)
          Swal.fire({
            title: "Error",
            text: "Details Please try again later.",
            icon: "error",
            confirmButtonColor: '#3085d6',
          })
        }
      }
    })

  };

  const handleSaveBankDetails = async (event) => {
    event.preventDefault();
    Swal.fire({
      icon: "warning",
      title: "Create new bank details",
      text: "creating new bank details...",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { key, iban, account_name, bic, owner, bank_name, reference } = editedDetail
          const res = await createBankDetails({ token: adminToken, ...editedDetail })
          if (res.data.status === "success") {
            refetch()
            Swal.fire({
              title: "Details created successfully",
              icon: "success",
              confirmButtonColor: '#3085d6',
            })
          } else {
            Swal.fire({
              title: "Details already exists",
              text: "Details already present",
              icon: "info",
              confirmButtonColor: '#3085d6',
            })
          }
        } catch (err) {
          Swal.fire({
            title: "Error",
            text: "An error occurred while updating the lead. Please try again later.",
            icon: "error",
            confirmButtonColor: '#3085d6',
          })
        }
      }
    })
  };
  const handleSaveEditedBankDetails = (bank) => {
    setEditedDetail(bank);
    handleShowModal();
    Swal.fire({
      icon: "info", 
      title: "Edit bank details", 
      text: "confirm edit bank details",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then(async (result) =>{
      if(result.isConfirmed){
        const res = await editBankDetails({token: adminToken, bank_id: parseInt(editedDetail.id), bankDetails: editedDetail, key: "Less Loved"})
       if(res?.data.status === 'success'){
        refetch()
         Swal.fire({
           icon: 'success', 
           title: 'Bank details edited successfully'
          })
        }else{
          Swal.fire({
            icon: 'error', 
            title: 'An error occured please try again later'
           })
        }
      }
    })
  handleCloseModal();
};
  const handleSaveEditedDetails = () => {
      setEditedCryptoDetail(crypto);
      Swal.fire({
        icon: "info", 
        title: "Edit crypto details", 
        text: "confirm edit crypto details",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, create it!'
      }).then(async (result) =>{
        if(result.isConfirmed){
          const res = await editCryptoDetails({token: adminToken, crypto_id: parseInt(editedCryptoDetail.id), crypto: editedCryptoDetail, key: editedCryptoDetail.key})
          if(res.data.status === "success"){
            refetch()
            Swal.fire({
              icon: "success", 
              title: "Edited success", 
             
            })
          }
        }
      }).catch(err=>
      {
        Swal.fire({
          icon: "error", 
          title: "An error occured while editing"
        })
      })
    handleCloseModal();
  };

  const handleEditDetails = (bank) => {
    setEditedDetail(bank);
    handleShowModal();
  };

  const handleEditCryptoDetails = (crypto) => {
    setEditedCryptoDetail(crypto);
    handleShowModal();
  };
  return (
    <div className='container'>
      <h2 className='text-center'>View Payment Details</h2>
      <div className='d-flex justify-content-center' style={{ gap: "20px" }}>
        <Button
          variant={selectedButton === 'Bank' ? 'primary' : 'secondary'}
          onClick={() => handleButtonClick('Bank')}
          className='mr-3'
        >
          Bank transfer
        </Button>
        <Button
          variant={selectedButton === 'Crypto' ? 'primary' : 'secondary'}
          onClick={() => handleButtonClick('Crypto')}
        >
          Crypto
        </Button>
      </div>
      <div className="text-center mt-3">

        <Button variant="success" onClick={selectedButton === 'Bank' ? handleCreateNewBankDetails : handleCreateNewCryptoDetails}>
          Create new {selectedButton} details
        </Button>
        {/* <Button variant="success" onClick={handleCreateNewCryptoDetails} style={{ marginLeft: "20px" }}>
          Create new Crypto details
        </Button> */}
      </div>
      <div className='mt-4'>
        <Card className='shadow' style={{backgroundColor: 'rgba(243, 243, 243, 0.04)'}}>
          <Card.Body>
            {selectedButton === 'Bank' && bankDetails.length > 0 ? (
               <ul className='list-unstyled' style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {bankDetails.map((bank, index) => (
                  <div style={{ border: "0px solid gray", borderRadius: "20px", padding: "10px", flex: "1 1 300px" }}>

                  <React.Fragment key={index} >
                  <li key={index}>
                      <span className='font-weight-bold'>Bank Name:</span> {bank.bank_name}<br />
                      <span className='font-weight-bold'>IBAN:</span> {bank.iban}<br />
                      <span className='font-weight-bold'>Account Name:</span> {bank.account_name}<br />
                      <span className='font-weight-bold'>Owner:</span> {bank.owner}<br />
                      <span className='font-weight-bold'>BIC:</span> {bank.bic}<br />
                      <span className='font-weight-bold'>Reference:</span> {bank.reference}
                    </li>
                    <Button  onClick={() => handleEditDetails(bank)}>Edit Details</Button>
                  </React.Fragment>
                  </div>
                ))}
              </ul>
            ) : selectedButton === 'Crypto' && cryptoDetails.length > 0 ? (
              <ul className='list-unstyled' style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {paymentDetails?.crypto_details.map((crypto, index) => (
                <li key={index} style={{ border: "0px solid gray", borderRadius: "20px", padding: "10px", flex: "1 1 300px" }}>
                  <div className='mb-3'>
                    <span className='font-weight-bold'>Network Chain:</span> {crypto.network_chain}<br />
                    <span className='font-weight-bold'>Wallet Address:</span> {crypto.wallet_address}<br />
                    <span className='font-weight-bold'>Preferred token:</span> {crypto.preferred_token}<br />
                  </div>
                  <Button onClick={() => handleEditCryptoDetails(crypto)}>Edit Details</Button>
                </li>
              ))}
            </ul>
            
            ) : (
              <p>No details available</p>
            )}
          </Card.Body>

        </Card>

      </div>

      {/* Modal for creating and editing details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editedDetail.id || editedCryptoDetail.id ? 'Edit' : 'Create'} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedButton === 'Bank' ? (
            <BankForm
              editedDetail={editedDetail}
              setEditedDetail={setEditedDetail}
              saveFunction={editedDetail.id ? handleSaveEditedBankDetails : handleSaveBankDetails}
            />
          ) : (
            <CryptoForm
              editedCryptoDetail={editedCryptoDetail}
              setEditedCryptoDetail={setEditedCryptoDetail}
              saveFunction={editedCryptoDetail.id ? handleSaveEditedDetails : handleSaveCryptoDetails}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Finance;
