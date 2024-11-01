import { useState, useContext } from "react";
import ReactDOMServer from 'react-dom/server';
import { RingLoader } from "react-spinners";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { setUserAccount } from "../../redux-contexts/redux/features/account/accountSlice";
import Swal from "sweetalert2";
import { useGetUserAccountQuery } from "../../redux-contexts/redux/services/account";
import { BASE_URL } from '../../api';
export function useMainLayoutFunctions() {
  const { userToken, userInfo } = useSelector(state => state.auth);
  const { data, refetch } = useGetUserAccountQuery(userToken);
  const dispatch = useDispatch();
  const [yes, setYes] = useState(false);

  const fetchDataAndDispatch = () => {
    refetch();
    if (data) {
      dispatch(setUserAccount(data));
    }
  };

  const showProcessingLoader = () => {
    const processingElement = (
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: "column", alignItems: "center" }}>
        <RingLoader />
        <p>Requesting Verification Email..</p>
      </div>
    );
  
    const processingString = ReactDOMServer.renderToString(processingElement);
  
    Swal.fire({
      title: "Processing",
      html: processingString,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  };

  const showVerificationEmailSent = () => {
    Swal.fire({
      title: `Verification Email Sent to ${userInfo.email}`,
      icon: "info",
    });
  };
  
  const showVerifyConfirmation = () => {
    Swal.fire({
      title: "Verify Account",
      text: "Do you want to verify your account?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes",
      background: '#131722',
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        showProcessingLoader();
        axios.post(`${BASE_URL}/user/verify-and-reset/send-verification-email/`, null, {
          headers: {
            'x-token': userToken
          }
        })
        .then(response => {
          console.log(response)
          if (response.data.status === "success") {
            showVerificationEmailSent();
            setYes(true);
          } else {
            // Request failed, show error swal
            Swal.fire("Error", "Failed to send verification email. Please try again later.", "error");
          }
        })
        .catch(error => {
          // Request failed, show error swal
          Swal.fire("Error", "Failed to send verification email. Please try again later.", "error");
        });
      }
    });
  };

  return { fetchDataAndDispatch, showVerifyConfirmation };
}
