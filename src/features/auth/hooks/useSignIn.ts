// src/features/auth/hooks/use-sign-in.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormValues } from "./../schemas/login-schema";

export function useSignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorAPI, setError] = useState<Error | null>(null);

  // const form = useForm<SignInFormValues>({
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      console.log("Authentication payload submitted successfully:", data);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
      setError(null);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    errorAPI,
  };
}
