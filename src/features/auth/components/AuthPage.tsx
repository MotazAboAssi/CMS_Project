import { AuthCardWrapper, SignInForm, AuthCarousel } from "./";

export default function AuthPage() {
  return (
    <main className=" w-full h-screen bg-[#ecf3ff] flex items-center justify-center  antialiased selection:bg-blue-100 selection:text-[rgb(11_116_250/0.1)] p-0 m-0">
      <AuthCardWrapper className="scale-[0.59] ">
        <SignInForm />
        <AuthCarousel />
      </AuthCardWrapper>
    </main>
  );
}
