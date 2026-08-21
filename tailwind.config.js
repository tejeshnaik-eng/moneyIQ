/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#006b57",
        "primary-container": "#00b090",
        "primary-fixed": "#73f9d5",
        "on-primary": "#ffffff",
        "on-primary-container": "#003b2f",
        "surface": "#f7f9fb",
        "surface-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "on-surface": "#191c1e",
        "on-surface-variant": "#3c4a45",
        "secondary": "#565e74",
        "secondary-container": "#dae2fd",
        "tertiary": "#505f76",
        "tertiary-container": "#8d9db5",
        "outline": "#6c7a74",
        "outline-variant": "#E2E8F0",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['"Hedvig Letters Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
    },
  },
  plugins: [],
}
