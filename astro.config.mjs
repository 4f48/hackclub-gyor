// @ts-check
import { defineConfig } from "astro/config";

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
    ],
  },
});
