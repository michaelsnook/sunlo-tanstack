/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Helvetica Neue"',
          'Roboto',
          'Oxygen-Sans',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/forms'),
    require('daisyui'),
  ],
  daisyui: {
    styled: true,
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#663399',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#663399',
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
  },
}
