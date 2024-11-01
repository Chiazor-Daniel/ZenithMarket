/* eslint-disable */
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyToast = ({ message, type }) => {
  const toastType = type === "error" ? toast.TYPE.ERROR : toast.TYPE.SUCCESS;

  return toast(message, {
    type: toastType,
  });
};

export default MyToast;
