import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// Stopover — mini-app d'apprentissage de l'anglais, mobile-first, installable en PWA.
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'],
            manifest: {
                name: 'Stopover — English breaks',
                short_name: 'Stopover',
                description: "Des pauses de 2 à 5 minutes pour progresser en anglais, sans devoirs.",
                theme_color: '#FBEAEE',
                background_color: '#FBEAEE',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                scope: '/',
                icons: [
                    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
                    { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
            },
            workbox: {
                // Tout est généré en local : l'app doit fonctionner hors-ligne.
                globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
                navigateFallback: '/index.html',
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
    server: {
        host: true,
    },
});
