import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		'import.meta.env.TOKEN_API': JSON.stringify(process.env.TOKEN_API)
	}
});
