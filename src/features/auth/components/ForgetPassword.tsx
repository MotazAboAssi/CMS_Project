// import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

interface ForgotPasswordFormProps {
  isLoading?: boolean;
}
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
});
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
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

  const onSendResetLink = (email: string) => {
    console.log(email);
  };
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
          <h1 className="font-inter font-semibold text-3xl text-[rgba(26_27_30/1)] tracking-[-0.5px] leading-[1.3]">
            Forgot Password?
          </h1>
          <p className="font-inter font-normal text-[18px] text-[rgba(26_27_30/1)] tracking-normal leading-[1.6] mt-3 ">
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
          <div className="space-y-1.5">
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Enter you Email"
              disabled={isLoading}
              aria-invalid={errors.email ? "true" : "false"}
              className={cn(
                "w-full h-11 px-4 py-3 text-sm text-neutral-900 placeholder:text-[rgba(182_183_185/1)] bg-white border border-[#b6b7b9] rounded-lg outline-none focus:ring-4 transition-all duration-200 ",
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-neutral-200 focus:border-[#0066ff] focus:ring-blue-100",
              )}
            />
            {errors.email && (
              <p className="font-sans font-semibold text-xs text-red-500 pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Action Trigger Elements */}
          <div className="space-y-4 pt-16">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11.5 bg-[#0B74FA] hover:bg-[#b3d1ff] text-white font-inter font-semibold text-[18px] tracking-[2%] leading-[1.2] rounded-lg transition-all shadow-none disabled:opacity-50"
            >
              Sent reset link
            </Button>

            {/* Back to Log In Navigation Trigger */}
            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="inline-flex items-center gap-1.5 font-inter font-normal tracking-[2%] leading-normal text-sm text-[#0066ff] hover:underline underline-offset-4 cursor-pointer focus:outline-none py-1 px-2"
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
