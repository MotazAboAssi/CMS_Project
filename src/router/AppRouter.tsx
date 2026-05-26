import {
  WithCarouselCard,
  WithoutCarouselCard,
} from "@/features/auth/components";
import { AccountDeactivatedDialog, NoClinicAccessDialog } from "@/features/auth/components/Dialogs";
import {
  SignInForm,
  ConfirmEmailForm,
  CheckEmailForm,
  LinkExpiredForm,
  ResetPasswordForm,
  ResetSuccessForm,
  ForgotPasswordForm,
} from "@/features/auth/components/Forms";
import React from "react";
import { Routes, Route, useNavigate } from "react-router";

export default function AppRouter() {
  return (
    <Routes>
      <Route index element={<Redirect />} />
      <Route path="auth" element={<WithCarouselCard />}>
        <Route index element={<SignInForm />} />
        <Route path="login" element={<SignInForm />} />
        <Route path="otp" element={<ConfirmEmailForm />} />
        <Route path="forget_password" element={<ForgotPasswordView />} />
        <Route path="check_email" element={<CheckEmailForm />} />
      </Route>
      <Route path="auth" element={<WithoutCarouselCard />}>
        <Route path="link_expired" element={<LinkExpiredForm />} />
        <Route path="reset_password" element={<ResetPasswordForm />} />
        <Route path="reset_success" element={<ResetSuccessForm />} />
        <Route path="*" element={<h1>Not Found Page</h1>} />
      </Route>
      <Route path="test" />
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
          // redirect("/authlogin");
          navigate("/auth/login", { replace: true });
        }}
      >
        Click Here Man
      </button>
    </div>
  );
}

function ForgotPasswordView() {
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handlePasswordResetLookup = async (email: string) => {
    setIsSubmitting(true);
    try {
      // Execute your actual API endpoint request check here
      // const userExists = await checkEmailAction(email);
      const userExists = false;

      if (!userExists) {
        // If the system returns 404 (Email Not Found), trigger the Modal panel
        setShowErrorModal(true);
      } else {
        // Proceed to check email screen sequence
      }
    } catch (err) {
      console.log(err);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ForgotPasswordForm
        onSendResetLink={handlePasswordResetLookup}
        isLoading={isSubmitting}
      />

      {/* Accessible Portal Layer */}
      <NoClinicAccessDialog
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onContactSupport={() =>
          console.log("Redirecting to support helpdesk ticketing...")
        }
      />
      {/* <AccountDeactivatedDialog
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onContactSupport={() =>
          console.log("Redirecting to support helpdesk ticketing...")
        }
      /> */}
    </>
  );
}
