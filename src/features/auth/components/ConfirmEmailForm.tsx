import * as React from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { ConfirmEmailFormProps } from "../types";
import { useNavigate } from "react-router";

export default function ConfirmEmailForm({
  isLoading = false,
}: ConfirmEmailFormProps) {
  const [otpValue, setOtpValue] = React.useState<string>("");
  const [countdown, setCountdown] = React.useState<number>(60);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    if (countdown === 0) {
      setCountdown(60);
      // Trigger your programmatic API hook for code resends here
    }
  };

  const onVerifyCode = (code: string) => {
    console.log(code);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length === 6) {
      onVerifyCode(otpValue);
    }
  };
  const onBackToLogin = () => {
    navigate("/CMS_Project/auth/login", { replace: true });
  };

  return (
    <>
      <div className="flex-1 flex flex-col justify-center p-7 w-full mx-auto">
        <div className="mb-4">
          <h1 className="font-inter font-semibold   text-3xl text-[rgb(26_27_30/1)]  tracking-[-0.5px] leading-[1.3]">
            Confirm your Email
          </h1>
          <p className="leading-normal text-[rgb(146_146_150/1)] mt-2 font-normal font-inter text-sm">
            Enter the code we've sent to your email to confirm your account
          </p>
        </div>

        <div className="mb-13">
          {countdown > 0 ? (
            <span className="text-sm font-inter font-normal tracking-[2%] leading-normal text-[rgba(11_116_250/1)] underline">
              Resend code in {countdown} seconds
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-inter font-normal tracking-[2%] leading-normal text-[rgba(11_116_250/1)] underline cursor-pointer"
            >
              Resend verification code
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center w-full">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value: React.SetStateAction<string>) =>
                setOtpValue(value)
              }
              disabled={isLoading}
              className="w-full disabled:pointer-events-none"
            >
              <InputOTPGroup className="gap-2 sm:gap-2.5 w-full flex justify-between">
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-11 h-11 sm:w-12 sm:h-12 text-base sm:text-lg font-inter font-bold text-neutral-900 bg-white border border-neutral-600 rounded-xl transition-all duration-200 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-[#0066ff] shadow-none"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-3 mt-22">
            <Button
              type="submit"
              disabled={isLoading || otpValue.length < 6}
              className="w-full h-11 bg-[rgba(11_116_250/1)] hover:bg-[#b3d1ff] text-white font-inter font-semibold text-lg tracking-[2%] leading-[1.2] rounded-lg transition-all shadow-none  disabled:pointer-events-none disabled:opacity-50"
            >
              Confirm code
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center gap-1.5 font-inter font-normal leading-normal tracking-[2%]  text-[rgba(11_116_250/1)] hover:underline underline-offset-4 cursor-pointer focus:outline-none py-1 px-2"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                Back to Log in
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
