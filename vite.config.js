import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Serves api/*.js locally so `npm run dev` behaves like Vercel.
function devApi(env) {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/chat.js')
        handler(req, res, env)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return { plugins: [react(), devApi(env)] }
})
