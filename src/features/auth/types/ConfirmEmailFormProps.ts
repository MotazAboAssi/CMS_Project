export interface ConfirmEmailFormProps {
  onBackToLogin: () => void;
  onVerifyCode: (code: string) => void;
  isLoading?: boolean;
}