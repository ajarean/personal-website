import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    server: {
        watch: {
            ignored: ['**/*.{skel,atlas,png,jpg,mp4,webp,wav,ogg}']
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
