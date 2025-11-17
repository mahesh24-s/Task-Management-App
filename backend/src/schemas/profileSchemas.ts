import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100),
  country: z.string().max(100).optional().or(z.literal("").transform(() => undefined)),
  dateOfBirth: z
    .string()
    .datetime()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  gender: z
    .enum(["male", "female", "other"])
    .optional()
    .or(z.literal("").transform(() => undefined)),
  bio: z.string().max(500).optional().or(z.literal("").transform(() => undefined)),
  avatarUrl: z.string().url().optional().or(z.literal("").transform(() => undefined)),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


