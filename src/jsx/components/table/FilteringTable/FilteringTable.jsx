/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { GlobalFilter } from './GlobalFilter';
import Swal from 'sweetalert2';
import { Tab, Nav, Button, Spinner } from 'react-bootstrap';
import './filtering.css';
import { renderToString } from 'react-dom/server';
import { useSelector } from 'react-redux';
import { useUpdateUserTransactionMutation } from '../../../../redux-contexts/redux/services/admin';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useMakeNewTransactionMutation } from '../../../../redux-contexts/redux/services/admin';
import { Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
export const FilteringTable = ({ data, isLoading, user, userId, refetchUser, superAdmin }) => {
    const [currentTab, setCurrentTab] = useState('All');
    const [originalData, setOriginalData] = useState(data); // Store original data
    const { adminToken } = useSelector(state => state.adminAuth);
    const [transactionsData, setTransactionsData] = useState(data);
    const [updateUserTransaction, { isLoading: isTransactionLoading, error }] = useUpdateUserTransactionMutation();
    const [makeNewTransaction, { isLoading: isnewLoading, error: isnewError }] = useMakeNewTransactionMutation()
    const [transactionState, setTransactionState] = useState("")
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('deposit');
    const [balanceType, setBalanceType] = useState('main_balance');
    const transacStates = ["approved", "not_approved", "processing"]
    const [myTransac, setMyTransac] = useState('approved')
    const [selectredTransac, setSelectedTransac] = useState(false)
    const handleEditTransaction = async (row) => {
        let transactionStats = sessionStorage.getItem("stats")
        try {
            const result = await Swal.fire({
                title: `Update transaction status`,
                html: `<p>${transactionStats} transaction</p>`, // Use HTML to dynamically insert the value of myTransac
                icon: "info",
                showCancelButton: true,
                width: "600px",
                confirmButtonColor: "#3085d6",
                background: '#131722',
                cancelButtonColor: "#d33",
                confirmButtonText: "Update Transaction",
            });

            if (result.isConfirmed) {
                const updateResponse = await updateUserTransaction({
                    token: adminToken,
                    transaction_id: row.original.id,
                    user_id: parseInt(userId),
                    transaction_status: transactionStats,
                });

                console.log(updateResponse);

                if (updateResponse.data.status === "success") {
                    Swal.fire({
                        title: "Updated Successfully",
                        text: "Transaction Status has been updated",
                        icon: "success",
                        background: '#131722',
                    });
                    refetchUser();
                }
            }
        } catch (err) {
            Swal.fire({
                title: "Error",
                text: "An error occurred",
                icon: "error",
                background: '#131722',
            });
        }
    };

    useEffect(() => {
        setOriginalData(data);
    }, [data]);

    useEffect(() => {
        // Update transactionsData based on currentTab
        if (currentTab === "bank") {
            setTransactionsData(originalData.filter(transaction => transaction?.transaction_method === "bank-transfer"));
        } else if (currentTab === "crypto") {
            setTransactionsData(originalData.filter(transaction => transaction?.transaction_method === "cryptocurrency"));
        } else if (currentTab === "card") {
            setTransactionsData(originalData.filter(transaction => transaction?.transaction_method === "card-payment"));
        } else {
            setTransactionsData(originalData);
        }
    }, [currentTab, originalData]);

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
    };

    const columns = useMemo(() => [
        {
            Header: 'Id',
            accessor: 'id',
            Cell: ({ row }) => row.index + 1 // Use index to assign IDs starting from 1
        },
        {
            Header: 'Transaction Method',
            accessor: 'transaction_method'
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => {
                return (
                    <p style={{
                        padding: "4px",
                        backgroundColor: value === 'approved' ? 'green' : value === 'not_approved' ? 'red' : '#F3CA52',
                        color: "white",
                        textAlign: "center",
                        borderRadius: "20px"
                    }}>
                        {value}
                    </p>

                );
            }
        },
        {
            Header: 'Created At',
            accessor: 'created_at',
            Cell: ({ value }) => {
                const formattedDate = new Date(value).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                });
                return formattedDate;
            }
        },
        {
            Header: 'Transaction Amount',
            accessor: 'transaction_amount'
        },
        {
            Header: 'Transaction Type',
            accessor: 'transaction_type'
        },
        {
            Header: 'Action',
            Cell: ({ row }) => (
                user === 'admin' && (
                    <div style={{ display: "grid", alignItems: "center" }}>
                        <DropdownButton
                            id="dropdown-basic-button"
                            title="Update Transaction"
                            variant="secondary"
                            style={{
                                //   backgroundColor: value === 'approved' ? 'green' : value === 'not_approved' ? 'red' : '#F3CA52',
                                color: "white",
                                borderRadius: "20px",
                                padding: "4px",
                                textAlign: "center"
                            }}
                        >
                            <Dropdown.Item onClick={() => { setMyTransac('approved'); setTimeout(() => handleEditTransaction(row, myTransac), 1000) }}>Approve Transaction</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setMyTransac('processing'); setTimeout(() => handleEditTransaction(row, myTransac), 1000) }}>Processing Transaction</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setMyTransac('not_approved'); setTimeout(() => handleEditTransaction(row, myTransac), 1000) }}>Not Processed Transaction</Dropdown.Item>
                        </DropdownButton>
                    </div>
                )
            )
        }

    ], []);

    const tableInstance = useTable(
        {
            columns,
            data: transactionsData,
            initialState: { pageIndex: 0 }
        },
        useFilters,
        useGlobalFilter,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state,
        page,
        gotoPage,
        pageCount,
        pageOptions,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        setGlobalFilter,
    } = tableInstance;

    const { globalFilter, pageIndex } = state;

    const filteredData = currentTab === 'All' ? data : data.filter(item => item.transaction_method === currentTab);
    useEffect(() => {
        setTransactionsData(data);
    }, [refetchUser, data]);
    const [modalShow, setModalShow] = React.useState(false);
    useEffect(() => {
        console.log(myTransac)
        sessionStorage.setItem("stats", myTransac)
    }, [myTransac])

    return (
        <>
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create New Transaction
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="amount">
                            <Form.Label>Amount</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <FormControl
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="transactionType">
                            <Form.Label>Transaction Type</Form.Label>
                            <Form.Select
                                defaultValue={transactionType}
                                onChange={(e) => setTransactionType(e.target.value)}
                            >
                                <option value="deposit">deposit</option>
                                <option value="withdraw">withdraw</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="balanceType">
                            <Form.Label>Balance Type</Form.Label>
                            <Form.Select
                                value={balanceType}
                                onChange={(e) => setBalanceType(e.target.value)}
                            >
                                <option value="main_balance">Main Balance</option>
                                <option value="referral_balance">Referral Balance</option>
                                <option value="bonus_balance">Bonus Balance</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={async () => {
                        try {
                            const res = await makeNewTransaction({ user_id: userId, amount: amount, balance_type: balanceType, transaction_type: transactionType, token: adminToken })
                            console.log({ user_id: userId, amount: amount, balance_type: balanceType, transaction_type: transactionType, token: adminToken })
                            console.log("myRes", res.data.status)
                            if (res?.data?.status) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Deposit to user success",
                                    onClose: () => setModalShow(false)
                                })
                                refetchUser()
                            }
                        } catch (err) {
                            Swal.fire({
                                icon: "error",
                                title: "An error occurred",
                                onClose: () => setModalShow(false)
                            })
                        }
                    }}>
                        {
                            isnewLoading ? (
                                <Spinner animation="border" variant="light" />
                            ) : "Create new Transaction"
                        }
                    </Button>

                </Modal.Footer>
            </Modal>
            <div style={{padding: '20px'}}>
                <div className="card" style={{backgroundColor: 'rgba(243, 243, 243, 0.04)'}}>
                    <div className="card-header">
                        <div style={{ display: "flex", justifyContent: 'space-between', width: "100%" }}>
                            <h4 className="card-title">{user === "admin" ? "User" : "View"} Transactions</h4>
                            {(user === "admin" && superAdmin) && (
                                <Button onClick={() => setModalShow(true)}>Make New Transaction</Button>
                            )}
                        </div>
                    </div>
                    {
                        isLoading ? (
                            <p>Loading....</p>
                        ) : (
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="card-header border-0">
                                        <Nav as="ul" className="order  nav-tabs" id="pills-tab" role="tablist">
                                            <Nav.Item as="li" className="my-1" role="presentation">
                                                <Nav.Link as="button" eventKey="All" type="button" onClick={() => setCurrentTab("All")}>All</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="my-1" role="presentation">
                                                <Nav.Link as="button" eventKey="Spot" type="button" onClick={() => setCurrentTab("bank")}>Bank Transfer</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="my-1" role="presentation">
                                                <Nav.Link as="button" className="me-0" eventKey="Listing" type="button" onClick={() => setCurrentTab("card")}>Card Payment</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="my-1" role="presentation">
                                                <Nav.Link as="button" className="me-0" eventKey="Crypto" type="button" onClick={() => setCurrentTab("crypto")}>Crypto Payment</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>
                                    <table {...getTableProps()} className="table dataTable display">
                                        <thead>
                                            {headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps()}>
                                                            {column.render('Header')}
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        {/* <Form.Select
                                            defaultValue={myTransac}
                                            onChange={(e) => setMyTransac(e.target.value)}
                                        >
                                            <option value="approved">approved</option>
                                            <option value="processing">processing</option>
                                            <option value="not_approved">not approved</option>
                                        </Form.Select> */}
                                        <tbody {...getTableBodyProps()} className="">
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                            </div>
                                            {page.map((row) => {
                                                prepareRow(row)
                                                return (
                                                    <tr {...row.getRowProps()}>
                                                        {row.cells.map((cell, index) => {
                                                            // Check if the current cell corresponds to the "Transaction Amount" column
                                                            if (index === 4) { // Assuming "Transaction Amount" is the fifth column (index 4)
                                                                return <td {...cell.getCellProps()}>$ {cell.render('Cell')} </td>; // Prepend '$' to the cell value
                                                            } else {
                                                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>; // Render other columns normally
                                                            }
                                                        })}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="d-flex justify-content-between">
                                        <span>
                                            Page{' '}
                                            <strong>
                                                {pageIndex + 1} of {pageOptions.length}
                                            </strong>{''}
                                        </span>
                                        <span className="table-index">
                                            Go to page : {' '}
                                            <input type="number"
                                                className="ml-2"
                                                defaultValue={pageIndex + 1}
                                                onChange={e => {
                                                    const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
                                                    gotoPage(pageNumber)
                                                }}
                                            />
                                        </span>
                                    </div>
                                    <div className="text-center mb-3">
                                        <div className="filter-pagination  mt-3">
                                            <button className=" previous-button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
                                            <button className="previous-button" onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
                                            <button className="next-button" onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
                                            <button className=" next-button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default FilteringTable;
