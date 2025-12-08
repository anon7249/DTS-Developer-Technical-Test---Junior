import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
<<<<<<< HEAD
import { configDefaults } from 'vitest/config'
=======
>>>>>>> 7c10519 (upload coding challenge)

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
<<<<<<< HEAD
  test: {
    environment: 'happy-dom',
    setupFiles: './src/setupTests.js',
    globals: true,
    css: false,
    exclude: [...configDefaults.exclude, 'node_modules'],
  },
=======
>>>>>>> 7c10519 (upload coding challenge)
})
