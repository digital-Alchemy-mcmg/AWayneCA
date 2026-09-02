import { z } from "zod";

const optionalNonEmptyString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

export const serverEnvSchema = z.object({
  ASHANTE_SQLITE_PATH: z.string().trim().min(1).default(".local/ashante.sqlite"),
  FIREBASE_PROJECT_ID: optionalNonEmptyString,
  FIREBASE_CLIENT_EMAIL: optionalNonEmptyString,
  FIREBASE_PRIVATE_KEY: optionalNonEmptyString,
});

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: optionalNonEmptyString,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function readServerEnv(environment: NodeJS.ProcessEnv = process.env): ServerEnv {
  return serverEnvSchema.parse(environment);
}

export function readPublicEnv(environment: NodeJS.ProcessEnv = process.env): PublicEnv {
  return publicEnvSchema.parse(environment);
}
