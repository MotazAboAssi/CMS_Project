import * as React from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useSignIn } from "../hooks/useSignIn";
import { cn } from "@/lib/utils";
import LayoutCard from "./LayoutCard";

export default function  SignInForm() {
  const { form, onSubmit, isLoading, errorAPI } = useSignIn();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <LayoutCard>
      <div className="flex-1 flex flex-col justify-center p-7 w-full mx-auto">
        <div className="mb-8">
          <h1 className=" font-inter font-semibold text-4xl leading-[1.3] tracking-tight">
            Sign in
          </h1>
          <p className="text-sm text-neutral-400 mt-1.5 font-medium">
            Please login to continue to the system
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <div className="relative">
              <input
                {...register("email")}
                type="email"
                id="email"
                placeholder="Enter your email"
                disabled={isLoading}
                aria-invalid={errors.email || errorAPI ? "true" : "false"}
                className={cn(
                  "w-full px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-white border rounded-lg outline-hidden focus:ring-4 transition-all duration-200",
                  errors.email || errorAPI
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-200 focus:border-[#0066ff] focus:ring-blue-100",
                  isLoading ? "cursor-not-allowed" : "pointer-events-auto",
                )}
              />
            </div>
            {errors.email && (
              <p className="font-sans font-semibold text-xs text-red-500 pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                disabled={isLoading}
                aria-invalid={errors.password || errorAPI ? "true" : "false"}
                className={cn(
                  "w-full pl-4 pr-11 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-white border rounded-lg outline-hidden focus:ring-4 transition-all duration-200",
                  errors.password || errorAPI
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-neutral-200 focus:border-[#0066ff] focus:ring-blue-100",
                  isLoading ? "cursor-not-allowed" : "pointer-events-auto",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading}
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-200 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="font-sans font-semibold text-xs text-red-500 pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2.5 group cursor-pointer select-none">
              <input
                {...register("rememberMe")}
                type="checkbox"
                disabled={isLoading}
                className="w-4.5 h-4.5 border border-neutral-300 rounded-md checked:bg-[#0066ff] checked:border-[#0066ff] accent-[#0066ff] focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer disabled:cursor-not-allowed"
              />
              <span
                className={cn(
                  "text-xs font-medium text-neutral-600 group-hover:text-neutral-900 transition-colors",
                  isLoading ? "cursor-not-allowed" : "pointer-events-auto",
                )}
              >
                Keep me logged in
              </span>
            </label>
          </div>

          <div className="space-y-4 pt-2">
            {errorAPI && (
              <div className="flex items-center gap-2 text-red-500 pl-1 bg-red-50/50 p-2.5 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="font-sans font-medium text-xs tracking-wide">
                  {errorAPI.message || "An authentication error occurred."}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center h-12   hover:bg-[#b3d1ff] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white text-base leading-loose tracking-[2%] rounded-xl transition-all duration-200 focus:outline-hidden focus:ring-4 focus:ring-blue-100 cursor-pointer font-inter font-semibold",
                isLoading ? "bg-[#cce0ff]" : "bg-[rgba(11_116_250/1)]",
              )}
            >
              Sign in
            </button>

            <div className="text-center pt-1">
              <a
                href="#forgot-password"
                className="inline-block text-xs font-semibold text-[#0066ff] hover:underline underline-offset-4 focus:outline-hidden focus:ring-2 focus:ring-blue-200 rounded-sm px-1 py-0.5"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </form>
      </div>
    </LayoutCard>
  );
}
