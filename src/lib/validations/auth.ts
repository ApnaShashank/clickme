import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("INVALID_EMAIL_FORMAT"),
  password: z.string().min(1, "PASSWORD_REQUIRED"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "NAME_TOO_SHORT").max(50, "NAME_TOO_LONG"),
  email: z.string().email("INVALID_EMAIL_FORMAT"),
  instagramUsername: z.string().min(2, "USERNAME_TOO_SHORT").startsWith("@", "MUST_START_WITH_@"),
  password: z
    .string()
    .min(8, "PASSWORD_MIN_8_CHARS")
    .regex(/[A-Z]/, "PASSWORD_NEED_UPPERCASE")
    .regex(/[0-9]/, "PASSWORD_NEED_NUMBER")
    .regex(/[^A-Za-z0-9]/, "PASSWORD_NEED_SPECIAL_CHAR"),
  avatarUrl: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("INVALID_EMAIL_FORMAT"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "PASSWORD_MIN_8_CHARS")
    .regex(/[A-Z]/, "PASSWORD_NEED_UPPERCASE")
    .regex(/[0-9]/, "PASSWORD_NEED_NUMBER")
    .regex(/[^A-Za-z0-9]/, "PASSWORD_NEED_SPECIAL_CHAR"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "PASSWORDS_DO_NOT_MATCH",
  path: ["confirmPassword"],
});
