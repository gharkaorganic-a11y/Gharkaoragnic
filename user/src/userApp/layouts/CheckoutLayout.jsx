import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../features/auth/context/UserContext";
import { useCart } from "../features/cart/context/CartContext";
import UserNavbar from "../features/account/components/bars/UserNavbar";

const CheckoutLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, loading: authLoading } = useAuth();
  const { cart, loading: cartLoading } = useCart();

  const isCartEmpty = !cart || cart.length === 0;

  useEffect(() => {
    // ⛔ Wait until auth/cart state is ready
    if (authLoading || cartLoading) return;

    // 🔐 1. Not logged in → redirect to login
    if (!isLoggedIn) {
      navigate("/login", {
        state: { redirect: location.pathname },
        replace: true,
      });
      return;
    }

    // 🛒 2. Logged in but cart empty → redirect to cart
    if (isCartEmpty) {
      navigate("/checkout/cart", { replace: true });
    }
  }, [
    isLoggedIn,
    authLoading,
    cartLoading,
    isCartEmpty,
    navigate,
    location.pathname,
  ]);

  return (
    <div className="w-full min-h-screen bg-brand-light">
      {/* Top Navigation */}
      <UserNavbar />

      {/* Checkout Content */}
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default CheckoutLayout;
