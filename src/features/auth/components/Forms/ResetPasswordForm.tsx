import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

// Shadcn UI Button component
import { Button } from "@/components/ui/button";

import type {
  ResetPasswordFormProps,
  StrengthLevel,
} from "../../types/StrengthLevel";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../schemas/resetPasswordSchema";
import EyePasswordButton from "../EyePasswordButton";

export function ResetPasswordForm({
  isLoading = false,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password", "");

  const strength: StrengthLevel = React.useMemo(() => {
    if (!passwordValue) return "empty";

    if (passwordValue.length < 8) return "weak";

    const hasUpperCase = /[A-Z]/.test(passwordValue);
    const hasLowerCase = /[a-z]/.test(passwordValue);
    const hasNumber = /[0-9]/.test(passwordValue);
    const hasSymbol = /[^A-Za-z0-9]/.test(passwordValue);

    if (hasUpperCase && hasLowerCase && hasNumber && hasSymbol) {
      return "strong";
    }

    return "normal";
  }, [passwordValue]);

  const handleFormSubmit = (data: ResetPasswordFormData) => {
    if (strength !== "strong") return;
    onSubmitPassword(data.password);
  };

  const onSubmitPassword = (password: string) => {
    //  API
    console.log(password);
  };

  return (
      <div className="flex-1 flex flex-col justify-center   p-7 w-full mx-auto">
      <div className="mb-6">
        <h1 className="font-inter text-[36px] font-semibold leading-[1.3] tracking-[-0.5px] text-[#1A1B1E]">
          Reset your Password
        </h1>
        <p className="font-inter text-[22px] font-normal leading-[1.6] tracking-normal text-[#929296]">
          Enter a new password to reset your password
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
        noValidate
      >
        {/* Primary Password Input Field Frame */}
        <div className="space-y-1.5 relative">
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new Password"
              disabled={isLoading}
              className="w-full ps-4 pe-11 py-3 font-inter text-[20px] font-normal leading-normal tracking-normal text-[#1A1B1E] placeholder:text-neutral-400 bg-white border border-neutral-200 rounded-xl outline-none focus:border-[#0066ff] focus:ring-4 focus:ring-blue-100 transition-all duration-200"
            />
            <EyePasswordButton
              setShowPassword={setShowPassword}
              showPassword={showPassword}
            />
          </div>

          {/* Dynamic UI Password Strength Indicator Grid Rails */}
          {strength !== "empty" && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-300">
              <div className="grid grid-cols-3 gap-2">
                {/* Rail 1 */}
                <div
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    strength === "weak" && "bg-[#E53935]",
                    strength === "normal" && "bg-[#FEC008]",
                    strength === "strong" && "bg-[#4CAF50]",
                  )}
                />
                {/* Rail 2 */}
                <div
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    strength === "weak" && "bg-neutral-200",
                    strength === "normal" && "bg-[#FEC008]",
                    strength === "strong" && "bg-[#4CAF50]",
                  )}
                />
                {/* Rail 3 */}
                <div
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    strength === "weak" && "bg-neutral-200",
                    strength === "normal" && "bg-neutral-200",
                    strength === "strong" && "bg-[#4CAF50]",
                  )}
                />
              </div>

              {/* Dynamic Explanatory Label Copy Block */}
              <div className="space-y-0.5">
                <p
                  className={cn(
                    "text-xs font-bold font-sans tracking-tight",
                    strength === "weak" && "text-[#E53935]",
                    strength === "normal" && "text-[#FEC008]",
                    strength === "strong" && "text-[#4CAF50]",
                  )}
                >
                  {strength === "weak" && "Weak Password"}
                  {strength === "normal" && "Normal Password"}
                  {strength === "strong" && "Strong password"}
                </p>
                <p className="font-inter text-[18px] font-normal leading-normal tracking-[0.02em] text-[#929296]">
                  {strength === "weak" &&
                    "Password must be at least 8 characters long"}
                  {strength === "normal" &&
                    "Use a mix of numbers, letters and symbols"}
                  {strength === "strong" &&
                    "Your password meets all safety benchmarks"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your Password"
              disabled={isLoading}
              className={cn(
                "w-full ps-4 pe-11 py-3 font-inter text-[20px] font-normal leading-normal tracking-normal text-[#1A1B1E] placeholder:text-neutral-400 bg-white border rounded-xl outline-none focus:ring-4 transition-all duration-200",
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-neutral-200 focus:border-[#0066ff] focus:ring-blue-100",
              )}
            />
            <EyePasswordButton
              setShowPassword={setShowConfirmPassword}
              showPassword={showConfirmPassword}
            />
          </div>
          {errors.confirmPassword && (
            <p className="font-inter font-normal text-[18px] leading-[2%] tracking-[1.5] text-[#E53935] pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading || strength !== "strong"}
            className={cn(
              "w-full h-13 font-bold text-sm rounded-xl transition-all shadow-none disabled:opacity-50",
              strength === "strong"
                ? "bg-[#0066ff] hover:bg-[#0052cc] text-white"
                : "bg-[#cce0ff] text-[#0066ff] hover:bg-[#cce0ff]",
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              "Confirm Password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
