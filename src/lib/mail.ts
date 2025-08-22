import { RESEND_KEY } from "astro:env/server";
import { Resend } from "resend";

export const mail = new Resend(RESEND_KEY);
