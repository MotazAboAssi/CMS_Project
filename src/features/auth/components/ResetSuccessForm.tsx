import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResetSuccessForm() {
  const onBackToLogin = () => {};
  return (
    <>
      {/* Central focus workspace tailored to the signature max-width boundary layout */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-[360px] mx-auto py-6">
        {/* Core Success Typography Announcement Block */}
        <div className="mb-10">
          <h1 className="font-sans font-black text-3xl text-neutral-900 tracking-tight leading-none">
            Your good to go
          </h1>
          <p className="text-sm text-neutral-400 mt-4 font-medium leading-relaxed">
            Your password have been reset, go back to Login page and re-enter
            your informations
          </p>
        </div>

        {/* Navigation Action Trigger Block */}
        <div className="space-y-4">
          <Button
            type="button"
            onClick={onBackToLogin}
            className="w-full h-12 bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            Back to Login
          </Button>
        </div>
      </div>
    </>
  );
}
