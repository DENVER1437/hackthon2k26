/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--background) / <alpha-value>)',
                surface: 'rgb(var(--surface) / <alpha-value>)',
                surfaceHighlight: 'rgb(var(--surface-highlight) / <alpha-value>)',
                primary: 'rgb(var(--primary) / <alpha-value>)',
                'text-main': 'rgb(var(--text-main) / <alpha-value>)',
                'text-muted': 'rgb(var(--text-muted) / <alpha-value>)',
                critical: 'rgb(var(--critical) / <alpha-value>)',
                warning: 'rgb(var(--warning) / <alpha-value>)',
                success: 'rgb(var(--success) / <alpha-value>)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
