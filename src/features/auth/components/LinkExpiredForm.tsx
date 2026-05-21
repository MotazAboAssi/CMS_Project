import * as React from "react";
import { ArrowLeft } from "lucide-react";

// Shadcn UI Button dependency
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

// Functional Link Expired View Component
interface LinkExpiredFormProps {
  isLoading?: boolean;
}

export function LinkExpiredForm({ isLoading = false }: LinkExpiredFormProps) {
  const navigate = useNavigate();
  const onBackToLogin = () => {
    navigate("/CMS_Project/auth/login", { replace: true });
  };
  const onRequestNewLink = () => {};
  return (
    <>
      {/* Container tracking matching the signature 360px grid block boundaries */}
      <div className="flex-1 flex flex-col justify-center items-center ite p-7 w-full mx-auto">
        {/* Main Content Layout Block */}
        <div className="mb-10">
          <h1 className="font-sans font-black text-3xl text-neutral-900 tracking-tight leading-none">
            Link expired
          </h1>

          <p className="text-sm text-neutral-400 mt-4 font-medium leading-relaxed">
            This link is expired, contact your admin or{" "}
            <button
              onClick={onRequestNewLink}
              disabled={isLoading}
              className="text-[#0066ff] font-bold hover:underline cursor-pointer inline bg-transparent p-0 border-none outline-none disabled:opacity-50"
            >
              request a new link
            </button>
          </p>
        </div>

        {/* Action Trigger Navigation Stack */}
        <div className="space-y-4 w-full">
          <Button
            onClick={onBackToLogin}
            disabled={isLoading}
            className="w-full  h-12 bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            Back to Login
          </Button>
        </div>
      </div>
    </>
  );
}
