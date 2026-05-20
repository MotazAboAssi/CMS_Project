import React from "react";
import {
  WithCarouselCard,
  SignInForm,
  ConfirmEmailForm,
} from "@/features/auth/components";
import { Routes, Route } from "react-router";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="CMS_Project">
        <Route path="auth" element={<WithCarouselCard />}>
          <Route path="login" element={<SignInForm />} />
          <Route
            path="otp"
            element={
              <ConfirmEmailForm
                onVerifyCode={function (): void {
                  throw new Error("Function not implemented.");
                }}
              />
            }
          />
          <Route index element={<SignInForm />} />
        </Route>
        <Route path="*" element={<h1>Not Found Page</h1>} />
      </Route>
      <Route path="*" element={<h1>Not Found Page</h1>} />
    </Routes>
  );
}
