import { z } from "zod";

export const flagCardSchema = z.object({
  body: z.object({
    reason: z.string().min(10, "Reason must be at least 10 characters"),
  }),
});
