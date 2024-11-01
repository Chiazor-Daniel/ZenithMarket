import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bg6 from '../../assets/images/background/bg6.jpg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useResetPassword from "../../customHooks/user/auth/useResetPassword";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const { newPassword, confirmPassword, setNewPassword, setConfirmPassword, resetPassword } = useResetPassword(token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await resetPassword();
    if (result.success) {
      toast.success('Password updated successfully', {
        onClose: () => navigate("/")
      });
    } else if (result.error) {
      alert(result.error);
    }
  };

  return (
    <div className="authincation h-100 p-meddle">
      <ToastContainer />
      <div className="bg-img-fix overflow-hidden col-12" style={{ background: '#fff url(' + bg6 + ')', height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="col-lg-6 bg-white rounded" style={{padding: "20px"}}>
          <h4 className="text-center mb-4">Reset Password</h4>
          <form onSubmit={handleSubmit} className="col-8" style={{margin: "auto"}}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                className="form-control mb-4"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control mb-4"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
