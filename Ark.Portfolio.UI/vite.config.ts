import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), basicSsl()],
    resolve: {
        alias: {
            '@ark/portfolio-share': path.resolve(__dirname, '../Ark.Portfolio.Share/index.ts')
        }
    },
    server: {
        port: 3080,
        https: true
    }
})
