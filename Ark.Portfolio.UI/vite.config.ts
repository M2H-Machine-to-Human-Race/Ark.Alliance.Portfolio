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
        https: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3085', // Backend runs HTTP by default
                changeOrigin: true,
                secure: false,
            },
            '/Assets': {
                target: 'http://localhost:3085', // Serve assets from backend
                changeOrigin: true,
                secure: false,
            }
        }
    },
    build: {
        chunkSizeWarningLimit: 4000,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'charting': ['chart.js', 'react-chartjs-2', 'chartjs-plugin-zoom'],
                    'animations': ['framer-motion'],
                    'icons': ['lucide-react'],
                    'markdown': [
                        'react-markdown',
                        'remark-gfm',
                        'remark-math',
                        'rehype-highlight',
                        'rehype-slug',
                        'rehype-autolink-headings',
                        'rehype-katex'
                    ],
                    'ui-lib': ['ark-alliance-react-ui'],
                    'mermaid': ['mermaid'],
                    'utils': ['axios', 'clsx', 'tailwind-merge', 'class-variance-authority']
                }
            }
        }
    }
})


