import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': 'http://api:8080',
      '/register': 'http://api:8080',
      '/login': 'http://api:8080',
      '/logout': 'http://api:8080',
      '/manage': 'http://api:8080',
      '/refresh': 'http://api:8080',
      '/confirmEmail': 'http://api:8080',
      '/resendConfirmationEmail': 'http://api:8080',
      '/forgotPassword': 'http://api:8080',
      '/resetPassword': 'http://api:8080',
    },
  },
})
