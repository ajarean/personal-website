import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    server: {
        watch: {
            ignored: ['**/assets/**']
        }
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                ba:   resolve(__dirname, 'ba.html'),
            }
        }
    }
})
