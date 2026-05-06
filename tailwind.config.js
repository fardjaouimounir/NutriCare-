/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A64B62',    // Deep Rose
        secondary: '#F1F3F5',  // Precise Gray
        accent: '#5E6D7E',     // Professional Slate
        neutral: '#FDFDFD',    // Ultra-clean White
        white: '#FFFFFF',
        dark: '#1A1C1E',       // Serious Black
        success: '#4A7C59',
        warning: '#C68B59',
        'text-dark': '#212529',
        'text-muted': '#6C757D',
        glass: 'rgba(255,255,255,0.6)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        ui: ['"Inter"', 'sans-serif'],
        arabic: ['"Noto Kufi Arabic"', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(232, 70, 122, 0.12)',
      },
      borderRadius: {
        'card': '16px',        // More architectural
        'component': '8px',    // More precise
      }
    },
  },
  plugins: [],
}
