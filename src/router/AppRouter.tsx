// import React from "react";
import {
  WithCarouselCard,
  SignInForm,
  ConfirmEmailForm,
} from "@/features/auth/components";
import { Routes, Route, useNavigate } from "react-router";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="CMS_Project">
        <Route index element={<Redirect />} />
        <Route path="auth" element={<WithCarouselCard />}>
          <Route index element={<SignInForm />} />
          <Route path="login" element={<SignInForm />} />
          <Route path="otp" element={<ConfirmEmailForm />} />
        </Route>
        <Route path="*" element={<h1>Not Found Page</h1>} />
      </Route>
      <Route path="*" element={<h1>Not Found Page</h1>} />
    </Routes>
  );
}

function Redirect() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen  justify-center items-center">
      <button
        onClick={() => {
          // redirect("/CMS_Project/auth/login");
          navigate("/CMS_Project/auth/login", { replace: true });
        }}
      >
        Click Here Man
      </button>
    </div>
  );
}
