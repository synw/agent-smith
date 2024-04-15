const colors = require('tailwindcss/colors');
const { addDynamicIconSelectors } = require('@iconify/tailwind');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    './node_modules/@snowind/**/*.{vue,js,ts}',
    './node_modules/vuepython/**/*.{vue,js,ts}',
    './node_modules/vuecodit/**/*.{vue,js,ts}',
    //'./node_modules/@docdundee/vue/**/*.{vue,js,ts}',
  ],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms'),
    require('@snowind/plugin'),
    require('tailwindcss-semantic-colors'),
    require('@tailwindcss/typography'),
    addDynamicIconSelectors(),
  ],
  theme: {
    extend: {
      maxWidth: {
        'prose': '52rem',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: 'normal',
            },
            'code::after': {
              content: 'normal',
            },
          },
        },
      }),
      semanticColors: {
        primary: {
          light: {
            bg: colors.slate[700],
            txt: colors.white
          },
          dark: {
            bg: colors.slate[900],
            txt: colors.neutral[100]
          }
        },
        secondary: {
          light: {
            bg: colors.slate[400],
            txt: colors.neutral[100]
          },
          dark: {
            bg: colors.neutral[900],
            txt: colors.neutral[100]
          }
        },
        background: {
          light: {
            bg: colors.white,
            txt: colors.gray[800]
          },
          dark: {
            bg: colors.slate[950],
            txt: colors.neutral[300]
          }
        },
      }
    }
  }
}