/* eslint-disable */
import React from 'react';
import { Form, Button } from 'react-bootstrap';

const BankForm = ({ editedDetail, setEditedDetail, saveFunction }) => {
  return (
    <Form>
      <Form.Group controlId="bankIban">
        <Form.Label>IBAN</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter IBAN"
          required
          value={editedDetail.iban}
          onChange={(e) => setEditedDetail({ ...editedDetail, iban: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="bankAccountName">
        <Form.Label>Account Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter account name"
          required
          value={editedDetail.account_name}
          onChange={(e) => setEditedDetail({ ...editedDetail, account_name: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="bankOwner">
        <Form.Label>Owner</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter owner name"
          required
          value={editedDetail.owner}
          onChange={(e) => setEditedDetail({ ...editedDetail, owner: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="bankName">
        <Form.Label>Bank Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter bank name"
          required
          value={editedDetail.bank_name}
          onChange={(e) => setEditedDetail({ ...editedDetail, bank_name: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="bankBic">
        <Form.Label>BIC</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter BIC"
          required
          value={editedDetail.bic}
          onChange={(e) => setEditedDetail({ ...editedDetail, bic: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="bankReference">
        <Form.Label>Reference</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter reference"
          required
          value={editedDetail.reference}
          onChange={(e) => setEditedDetail({ ...editedDetail, reference: e.target.value })}
        />
      </Form.Group>
      <Button variant="primary" onClick={saveFunction}>
        {editedDetail.id ? 'Save' : 'Create'}
      </Button>
    </Form>
  );
};

const CryptoForm = ({ editedCryptoDetail, setEditedCryptoDetail, saveFunction }) => {
  return (
    <Form>
      <Form.Group controlId="cryptoWalletAddress">
        <Form.Label>Wallet Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter wallet address"
          required
          value={editedCryptoDetail.wallet_address}
          onChange={(e) => setEditedCryptoDetail({ ...editedCryptoDetail, wallet_address: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="cryptoOwner">
        <Form.Label>Network chain</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter network chain"
          required
          value={editedCryptoDetail.network_chain}
          onChange={(e) => setEditedCryptoDetail({ ...editedCryptoDetail, network_chain: e.target.value })}
        />
      </Form.Group>
      <Form.Group controlId="cryptoType">
        <Form.Label>Preferred token</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter preferred token"
          required
          value={editedCryptoDetail.preferred_token}
          onChange={(e) => setEditedCryptoDetail({ ...editedCryptoDetail, preferred_token: e.target.value })}
        />
      </Form.Group>
      <Button variant="primary" onClick={saveFunction}>
        {editedCryptoDetail.id ? 'Save' : 'Create'}
      </Button>
    </Form>
  );
};

export { BankForm, CryptoForm };
