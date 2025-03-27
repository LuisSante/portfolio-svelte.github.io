import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		'import.meta.env.GITHUB_TOKEN': JSON.stringify(process.env.GITHUB_TOKEN)
	}
});
