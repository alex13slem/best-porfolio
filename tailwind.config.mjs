const defaultTheme = require('tailwindcss/defaultTheme');
/**
 * @type {import('tailwindcss').Config}
 */
export default {
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
    },
    colors: {
      ...defaultTheme.colors,
      black: '#111',
      slate: '#090f16',
      white: '#ffffff',
      cyan: '#b9bcfe',
      yellow: '#f2cb9f',
      transparent: 'transparent',
      current: 'currentColor',
      cyangrey: '#DFE5EC',
      yellowgrey: '#c8c8c3',
      darkgrey: '#1b2227',
    },
    screens: {
      ...defaultTheme.screens,
      '2xl': '64rem',
    },
    container: {
      center: true,

      padding: {
        DEFAULT: '2rem',
      },
    },
  },

  plugins: [],
};
