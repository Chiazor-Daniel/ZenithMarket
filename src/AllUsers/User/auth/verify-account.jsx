import React from 'react';
import { RingLoader } from 'react-spinners';
import bg6 from '../../assets/images/background/bg6.jpg';
import useEmailVerification from '../../customHooks/auth/useVerifyEmail';

const VerifyEmail = () => {
    const { loading } = useEmailVerification();

    return (
        <div className="browse-job login-style3">
            <div className="bg-img-fix overflow-hidden" style={{ background: '#fff url(' + bg6 + ')', height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <RingLoader color="#36d7b7" size={100} loading={loading} />
            </div>
        </div>
    );
};

export default VerifyEmail;
