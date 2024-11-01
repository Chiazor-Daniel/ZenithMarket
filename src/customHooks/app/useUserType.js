import { useEffect, useState } from 'react';

export function useUserType() {
  const [userType, setUserType] = useState("admin");
  const [asAdmin, setAsAdmin] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);

  useEffect(() => {
    const initialUserType = localStorage.getItem('userType');
    setUserType(initialUserType);

    const initialSuperAdmin = localStorage.getItem('superAdmin') === 'true';
    setSuperAdmin(initialSuperAdmin);
  }, []);

  useEffect(() => {
    localStorage.setItem('userType', userType);
    sessionStorage.setItem('userType', userType);
  }, [userType]);

  useEffect(() => {
    localStorage.setItem('superAdmin', superAdmin);
  }, [superAdmin]);

  useEffect(() => {
    localStorage.setItem('asAdmin', JSON.stringify(asAdmin));
  }, [asAdmin]);

  useEffect(() => {
    asAdmin && setUserType("user");
  }, [asAdmin]);

  return { userType, setUserType, asAdmin, setAsAdmin, superAdmin, setSuperAdmin };
}
