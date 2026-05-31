import { z } from "zod";
import { onlyDigits } from "./phone";

const nameRegex = /^[A-Za-zÀ-ÿ'’.-]+(?:\s+[A-Za-zÀ-ÿ'’.-]+)+$/;

export const subscriptionSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo.")
    .regex(nameRegex, "Informe nome e sobrenome."),

  telefone: z
    .string()
    .transform((value) => onlyDigits(value))
    .pipe(
      z
        .string()
        .length(11, "Informe um celular com DDD: (XX) XXXXX-XXXX.")
        .regex(
          /^[1-9][0-9]9\d{8}$/,
          "Celular inválido. Use o formato (XX) XXXXX-XXXX.",
        ),
    ),

  empresa: z.string().trim().min(2, "Informe o nome da empresa."),

  email: z
    .string()
    .trim()
    .min(1, "Informe seu email.")
    .email("Email inválido."),
});

export type SubscriptionInput = z.input<typeof subscriptionSchema>;
export type SubscriptionData = z.output<typeof subscriptionSchema>;
