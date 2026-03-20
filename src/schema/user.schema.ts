import z from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string({
        message: 'Name is required',
      }),
      password: z
        .string({
          message: 'Password is required',
        })
        .min(6, 'Password too short!, at least 6 characters minimum.'),
      passwordConfirmation: z.string({
        message: 'Confirm password is required!',
      }),
      email: z.email({
        error: (issue) =>
          issue.input === undefined ? 'email is required' : 'not valid email',
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;
