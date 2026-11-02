import React from "react";
import { Outlet } from "react-router-dom";

const CheckoutLayout = () => {
  return (
    <div className="min-h-screen w-full bg-white">
      <Outlet />
    </div>
  );
};

export default CheckoutLayout;
