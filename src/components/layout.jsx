import React, { Suspense } from 'react';
import NavBar from './navbar';
import Footer from './footer';
import { Outlet } from 'react-router-dom';

const MyLayout = ({ children }) => {
  return (
    <div className='bg-black min-h-screen flex flex-col'>
      <NavBar />
      <Suspense fallback={<div className='text-red-500 bg-black h-full w-full'>Loading...</div>}>
        <div className='flex-grow'>
          <Outlet />
        </div>
      </Suspense>
      <Footer />
    </div>
  );
}

export default MyLayout;
