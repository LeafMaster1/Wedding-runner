import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// adapter-auto supports environments which are supported out-of-the-box, including Vercel
		// see https://kit.svelte.dev/docs/adapters for more information about adapters
		adapter: adapter()
	}
};

export default config;
