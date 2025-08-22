import { Resend } from "resend";

export const mail = new Resend(import.meta.env.RESEND_KEY);
