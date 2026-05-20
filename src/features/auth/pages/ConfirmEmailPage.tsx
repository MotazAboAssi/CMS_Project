import React from "react";
import { ConfirmEmailForm, WithCarouselCard } from "../components";

export default function ConfirmEmailPage() {
  return (
    <WithCarouselCard>
      <ConfirmEmailForm onBackToLogin={function (): void {
        // use route
              throw new Error("Function not implemented.");
          } } onVerifyCode={function (): void {
            // custome hook
              throw new Error("Function not implemented.");
          } } />
    </WithCarouselCard>
  );
}
