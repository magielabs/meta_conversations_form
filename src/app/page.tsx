import { SignupForm } from "@/components/SignupForm";

export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <section
        className={[
          "w-full max-w-[470px] rounded-[28px] px-7 py-9 sm:px-10 sm:py-10",
          "lg:max-w-[548px] lg:rounded-[32px] lg:px-12 lg:py-12",
          "border border-white/60 bg-white/45 backdrop-blur-xl",
          "shadow-[0_24px_60px_-20px_rgba(70,80,120,0.35)]",
        ].join(" ")}
      >
        <SignupForm />
      </section>
    </main>
  );
}
