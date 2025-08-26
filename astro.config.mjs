// @ts-check
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

export default defineConfig({
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
			experimental: { remoteBindings: true },
		},
		imageService: "cloudflare",
	}),
	env: {
		schema: {
			DISCORD_BOT_TOKEN: envField.string({
				context: "server",
				access: "secret",
				optional: false,
			}),
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
			TURNSTILE_SITE_KEY: envField.string({
				context: "client",
				access: "public",
				optional: false,
			}),
			TURNSTILE_SECRET_KEY: envField.string({
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
			{
				cssVariable: "--font-fraunces",
				name: "Fraunces",
				provider: "local",
				variants: [
					{
						src: ["./src/assets/fonts/Fraunces[SOFT,WONK,opsz,wght].woff2"],
						style: "normal",
						variationSettings: '"WONK" 0',
					},
				],
			},
		],
	},
	integrations: [svelte(), sitemap()],
	output: "server",
	site: "https://hackclubgyor.com",
	vite: {
		plugins: [tailwindcss()],
	},
});
