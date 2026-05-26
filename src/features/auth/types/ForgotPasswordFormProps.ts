export interface ForgotPasswordFormProps {
  onSendResetLink: (email: string) => void;
  isLoading?: boolean;
}