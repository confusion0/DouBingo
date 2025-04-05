import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: parseInt(process.env.PORT || '3000'),  // Default to 3000 if not set
  },
  plugins: [
    react()
  ],
})
