"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscriptionSchema, type SubscriptionInput } from "@/lib/schema";
import { formatPhone } from "@/lib/phone";
import { Field } from "./Field";
import { Logo } from "./Logo";

export function SignupForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SubscriptionInput>({
    resolver: zodResolver(subscriptionSchema),
    mode: "onChange",
    defaultValues: { nome: "", telefone: "", empresa: "", email: "" },
  });

  async function onSubmit(values: SubscriptionInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Erro ao enviar.");
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar. Tente novamente.",
      );
    }
  }

  if (submitted) {
    return <Confirmation />;
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <header className="text-center">
        <h1 className="font-title text-[23px] font-bold leading-[1.18] tracking-tight text-balance text-ink lg:text-[27px]">
          Receba a cobertura do maior evento do ano da Meta no seu WhatsApp
        </h1>
        <p className="mx-auto mt-3 max-w-[330px] font-subtitle text-[14px] leading-snug text-ink-soft lg:mt-4 lg:max-w-[370px] lg:text-[15.5px]">
          O time da <strong className="font-semibold text-ink">Magie</strong>{" "}
          acompanha o evento por você e te manda os principais anúncios em
          primeira mão.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-7 flex flex-col gap-4 lg:mt-8 lg:gap-[18px]"
      >
        <Field
          label="Nome"
          autoComplete="name"
          error={errors.nome?.message}
          {...register("nome")}
        />

        <Controller
          control={control}
          name="telefone"
          render={({ field }) => (
            <Field
              id="telefone"
              label="Telefone"
              inputMode="numeric"
              autoComplete="tel"
              value={field.value}
              onBlur={field.onBlur}
              onChange={(e) => field.onChange(formatPhone(e.target.value))}
              error={errors.telefone?.message}
            />
          )}
        />

        <Field
          label="Empresa"
          autoComplete="organization"
          error={errors.empresa?.message}
          {...register("empresa")}
        />

        <Field
          label="Email Corporativo"
          type="email"
          inputMode="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        {serverError ? (
          <p className="-mt-1 text-center text-[13px] text-red-500">
            {serverError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={[
            "mt-1 h-[46px] w-full rounded-xl font-body text-[15px] font-medium transition-colors lg:h-[50px] lg:text-[16px]",
            isValid && !isSubmitting
              ? "cursor-pointer bg-accent text-white hover:bg-accent-hover"
              : "cursor-not-allowed bg-[#e8eaed] text-[#9aa0a6]",
          ].join(" ")}
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}

function Confirmation() {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/icon_check.svg"
        alt="Confirmado"
        width={56}
        height={56}
        className="animate-check-pop h-14 w-14 lg:h-[68px] lg:w-[68px]"
      />
      <h2 className="animate-fade-rise anim-delay-1 mt-5 font-title text-[26px] font-bold text-ink lg:text-[31px]">
        Inscrição confirmada
      </h2>
      <p className="animate-fade-rise anim-delay-2 mx-auto mt-3 max-w-[360px] font-subtitle text-[14px] leading-relaxed text-ink-soft lg:max-w-[400px] lg:text-[15.5px]">
        Nosso time vai cobrir o evento de{" "}
        <strong className="font-semibold text-ink">3 de junho</strong> e enviar
        os destaques no WhatsApp logo depois. Não precisa gastar horas
        acompanhando, a gente faz isso por você.
      </p>
    </div>
  );
}
