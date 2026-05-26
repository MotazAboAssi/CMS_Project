// import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";

import type { ForgotPasswordFormProps } from "../../types";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../../schemas";

export function ForgotPasswordForm({
  onSendResetLink,
  isLoading = false,
}: ForgotPasswordFormProps) {
  // const [email, setEmail] = React.useState<string>("");
  // const [error, setError] = React.useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    // } = useForm<ForgotPasswordFormData>({
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // const onSendResetLink = (email: string) => {
  //   console.log(email);
  // };
  const onSubmit = (data: ForgotPasswordFormData) => {
    onSendResetLink(data.email);
  };
  const onBackToLogin = () => {
    history.back();
  };
  return (
    <>
      {/* Container restricted to the signature 360px max-width boundary for consistent form layouts */}
      <div className="flex-1 flex flex-col justify-center p-7 w-full mx-auto">
        {/* Form Typography Header Layout */}
        <div className="mb-8">
          <h1 className="font-inter text-[36px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#1A1B1E]">
            Forgot Password?
          </h1>
          <p className="font-inter text-[22px] font-normal leading-[1.6] tracking-normal text-[#929296] mt-3 ">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {/* Input & Action Trigger Form Block */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Email Input Field */}
          <div className="space-y-4">
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Enter you Email"
              disabled={isLoading}
              aria-invalid={errors.email ? "true" : "false"}
              className={cn(
                "w-full h-12 px-4 py-3 font-inter font-normal text-[18px] leading-[2%] tracking-[1.5] text-[#E53935] placeholder:text-[rgba(182_183_185/1)] bg-white border border-[#b6b7b9] rounded-lg outline-none focus:ring-4 transition-all duration-200 ",
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-neutral-200 focus:border-[#0066ff] focus:ring-blue-100",
              )}
            />
            {errors.email && (
              <p className="font-inter font-normal text-[18px] leading-[2%] tracking-[1.5] text-[#E53935] pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Action Trigger Elements */}
          <div className="space-y-4 pt-16">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11.5 bg-[#0B74FA] hover:bg-[#b3d1ff] text-white font-inter font-semibold text-[22px] tracking-[2%] leading-[1.2] rounded-lg transition-all shadow-none disabled:opacity-50"
            >
              Sent reset link
            </Button>

            {/* Back to Log In Navigation Trigger */}
            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center gap-1.5 font-inter text-[18px] font-normal leading-normal tracking-[0.02em] text-center underline  decoration-0 text-[#0B74FA] hover:underline underline-offset-4 cursor-pointer focus:outline-none py-1 px-2"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                Back to Log in
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
