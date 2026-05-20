import type { ReactNode } from "react";
import { CardWithBackground, AuthCarousel, LayoutCard } from ".";

export default function WithCarouselCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className=" w-full h-screen bg-[#ecf3ff] flex items-center justify-center  antialiased selection:bg-blue-100 selection:text-[rgb(11_116_250/0.1)] p-0 m-0">
      <CardWithBackground className="scale-[0.59] ">
        <LayoutCard>{children}</LayoutCard>
        <AuthCarousel />
      </CardWithBackground>
    </main>
  );
}
