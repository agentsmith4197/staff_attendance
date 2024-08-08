import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <div className="flex h-screen w-screen ">
      <Sidebar />
      <div className="flex flex-col flex-1  overflow-auto ">
        <Header />
        <main className="flex-1  overflow-auto  p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
