const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          light: 'var(--primary-light)',
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)'
        },
        'secondary': {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)'
        },
        'white': {
          DEFAULT: 'var(--white)',
          dark: 'var(--white-dark)',
        },
        'grey': {
          light: 'var(--grey-light)',
          DEFAULT: 'var(--grey)',
          dark: 'var(--grey-dark)'
        },
        'black': {
          light: 'var(--black-light)',
          DEFAULT: 'var(--black)',
          pure: 'var(--black-pure)'
        },
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans]
      },
    },
  },
  plugins: [],
}
