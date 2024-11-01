import React, { useEffect } from 'react';
// import swal from '@sweetalert/with-react'
import swal from 'sweetalert';
const SweetAlert = ({ title, text, icon, confirmButtonText, onClose }) => {
  useEffect(() => {
    if (title && text && icon && confirmButtonText) {
      swal({
        title: title,
        text: text,
        icon: icon,
        buttons: confirmButtonText,
      }).then(onClose);
    }
  }, [title, text, icon, confirmButtonText, onClose]);

  return null;
}

const ExampleComponent = () => {
  const handleOpenAlert = () => {
    const dummyTitle = "Dummy Title";
    const dummyText = "This is a dummy alert text.";
    const dummyIcon = "info"; // You can set "success", "error", "warning", or "info"
    const dummyConfirmButtonText = "OK";
    const handleCloseAlert = () => {
      console.log("Alert closed"); // This is just for testing purposes, you can replace it with your logic
    };

    return <SweetAlert
      title={dummyTitle}
      text={dummyText}
      icon={dummyIcon}
      confirmButtonText={dummyConfirmButtonText}
      onClose={handleCloseAlert}
    />;
  };

  return (
    <div>
      <button onClick={handleOpenAlert}>Open Alert</button>
    </div>
  );
};

export default ExampleComponent;
