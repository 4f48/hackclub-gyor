// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import svelte from "@astrojs/svelte";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  experimental: {
    fonts: [
      {
        cssVariable: "--font-jbm",
        name: "JetBrains Mono",
        provider: "local",
        variants: [
          {
            src: ["./src/assets/fonts/JetBrainsMono[wght].woff2"],
            featureSettings: "'liga' 1, 'calt' 1",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/JetBrainsMono-Italic[wght].woff2"],
            featureSettings: "'liga' 1, 'calt' 1",
            style: "italic",
          },
        ],
      },
    ],
  },
  env: {
    schema: {
      DISCORD_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      DISCORD_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      DISCORD_WEBHOOK_URL: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      RESEND_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      TURSO_DATABASE_URL: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      TURSO_TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
    },
    validateSecrets: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [svelte()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
      experimental: { remoteBindings: true },
    },
    imageService: "cloudflare",
  }),
  output: "server",
});
