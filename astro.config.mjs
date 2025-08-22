// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  experimental: {
    fonts: [
      {
        cssVariable: "--font-inter",
        name: "Inter",
        provider: "local",
        variants: [
          {
            src: ["./src/assets/fonts/InterVariable.woff2"],
            featureSettings: "'liga' 1, 'calt' 1",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/InterVariable-Italic.woff2"],
            featureSettings: "'liga' 1, 'calt' 1",
            style: "italic",
          },
        ],
      },
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

  vite: {
    plugins: [tailwindcss()],
  },
});
