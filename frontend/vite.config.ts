import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  envPrefix: ['VITE_', 'REACT_APP_'],
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'),
    'import.meta.env.VITE_SITE_NAME': JSON.stringify(process.env.REACT_APP_SITE_NAME || 'eSIM Myanmar'),
    'import.meta.env.VITE_SITE_URL': JSON.stringify(process.env.REACT_APP_SITE_URL || 'https://esim.com.mm'),
  }
})