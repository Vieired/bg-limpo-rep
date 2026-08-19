// 	import { defineConfig as defineViteConfig, mergeConfig } from 'vite';
// 	import { defineConfig as defineVitestConfig } from 'vitest/config';
// 	import react from '@vitejs/plugin-react';
// 	const viteConfig = defineViteConfig({
// 	  plugins: [react()],
// 	});
// 	const vitestConfig = defineVitestConfig({
// 	  test: {
// 	    globals: true,
// 	    environment: "jsdom",
// 	  },
// 	});
// export default mergeConfig(viteConfig, vitestConfig);

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
})
