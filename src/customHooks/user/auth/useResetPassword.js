// useResetPassword.js
import { useState } from "react";
import axios from "axios";

const useResetPassword = (token) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.put(`https://trader-app.onrender.com/user/verify-and-reset/reset-password/?email_token=${token}&password=${newPassword}`, {
        token: token,
        newPassword: newPassword
      });
      if (response.data.status === "success") {
        return { success: true };
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      return { error: "Failed to reset password. Please try again." };
    }
  };

  return { newPassword, confirmPassword, setNewPassword, setConfirmPassword, resetPassword };
};

export default useResetPassword;
