const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

/**
 * @type {import('tailwindcss').Config}
 */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', ...defaultTheme.fontFamily.sans],
        logo: ['Shadows Into'],
      },
      backgroundImage: {
        noise: "url('/img/background_noisy.webp')",
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
    colors: {
      ...colors,
      black: '#111',
      bg: '#090f16',
      white: '#ffffff',
      cyan: '#b9bcfe',
      yellow: '#f2cb9f',
      transparent: 'transparent',
      current: 'currentColor',
      cyangrey: '#DFE5EC',
      yellowgrey: '#c8c8c3',
      darkgrey: '#1b2227',
    },
    container: {
      center: true,
      padding: '2rem',
    },
    screens: {
      ...defaultTheme.screens,
      '2xl': '64rem',
    },
  },

  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
