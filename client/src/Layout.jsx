import React from "react";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <>
      <div className="h-[90%] mx-auto p-4 md:p-8 w-[90%] bg-white rounded-2xl shadow-2xl">
        <h1 className="heading text-2xl font-bold text-center">
          Welcome to Type Sprint Game
        </h1>

        {children}
      </div>
    </>
  );
};

export default Layout;
