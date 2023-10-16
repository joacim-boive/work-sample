import { z } from 'zod';

export const addTransactionSchema = z
  .object({
    existingAccountId: z.string().or(z.literal('')),
    accountId: z
      .string()
      .min(5, { message: 'New Account ID has to be at least 5 characters' })
      .max(36, { message: 'New Account ID has to be at most 36 characters' })
      .or(z.literal('')),
    amount: z.coerce
      .number() // Changed to just number
      .refine((value) => value !== 0, 'Amount cannot be zero')
      .refine((value) => !isNaN(value), 'Amount must be a valid number'),
  })
  .superRefine((values, ctx) => {
    if (!values.existingAccountId && !values.accountId) {
      ctx.addIssue({
        message: 'Either select account or create a new one.',
        code: z.ZodIssueCode.custom,
        path: ['accountId'],
        fatal: true,
      });
      return z.NEVER;
    }
  });
