/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          green: {
            DEFAULT: '#2d5a27',
            dark: '#154212',
            light: '#9dd090',
            bg: '#bcf0ae',
            soft: '#eef7ec',
          },
          brown: {
            DEFAULT: '#8b5e3c',
            dark: '#805533',
            light: '#fdc39a',
            soft: '#faf2eb',
          },
          blue: {
            DEFAULT: '#0077b6',
            dark: '#003c5f',
            light: '#8bc8ff',
            soft: '#e6f3ff',
          },
          surface: {
            DEFAULT: '#f9f9f8',
            dim: '#d9dad9',
            container: '#edeeed',
            low: '#f3f4f3',
            card: '#ffffff',
          },
          text: {
            main: '#191c1c',
            muted: '#42493e',
            subtle: '#72796e',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(45, 90, 39, 0.08)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0,0,0,0.02)',
        'elevated': '0 10px 30px -5px rgba(21, 66, 18, 0.12)',
      }
    },
  },
  plugins: [],
};
