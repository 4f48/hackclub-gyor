import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  signup: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      school: z.string(),
      birthday: z.string().date(),
    }),
    handler: async (input) => {
      console.debug(input);
    },
  }),
};
