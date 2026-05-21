import * as React from "react";
import { ArrowLeft } from "lucide-react";

// Shadcn UI Button dependency
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

// 2. Functional Check Email Feedback Component
interface CheckEmailFormProps {
  emailAddress?: string;
}

export function CheckEmailForm({
  emailAddress = "Example@gmail.com",
}: CheckEmailFormProps) {
  const [countdown, setCountdown] = React.useState<number>(10);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 60000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    if (countdown === 0) {
      setCountdown(10);
      // Trigger your programmatic API hook for code resends here
    }
  };
  const onChangeEmail = () => {
    history.back();
  };
  const onBackToLogin = () => {
    navigate("/CMS_Project/auth/login", { replace: true });
  };
  return (
    <div className="flex-1 flex flex-col justify-center p-7 w-full mx-auto">
      {/* Main Header Typography Block */}
      <div>
        <h1 className="font-sans font-black text-3xl text-neutral-900 tracking-tight leading-none">
          Check you Email
        </h1>

        {/* Email Context Subtext */}
        <p className="text-sm text-neutral-400 mt-4 font-medium leading-relaxed">
          We send a reset link to{" "}
          <span className="text-[#0066ff] font-bold break-all">
            {emailAddress}
          </span>
          , you will receive it shortly
        </p>

        {/* Spam Warning Descriptive Copy Block */}
        <p className="text-sm text-neutral-400 mt-4 font-medium leading-relaxed">
          The link will be valid for 1 hour, if you didn't receive an email,
          please check your spamfolder
        </p>
      </div>

      {/* Dynamic Action Trigger Utilities */}
      <div className="mt-6 mb-8">
        {countdown > 0 ? (
          <span className="text-sm font-inter font-normal tracking-[2%] leading-normal text-[rgba(11_116_250/1)] underline">
            Resend code in {countdown} minute
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

      {/* Command Navigation Action Trigger Stack */}
      <div className="space-y-4">
        {/* Main Return Action CTA Option */}
        <Button
          type="button"
          onClick={onBackToLogin}
          className="w-full h-12 bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          Back to Login
        </Button>

        {/* Alternative State Link Trigger Modifier */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onChangeEmail}
            className="inline-block text-xs font-bold text-[#0066ff] hover:underline underline-offset-4 cursor-pointer focus:outline-none px-2 py-0.5"
          >
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
}
