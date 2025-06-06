/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        },
        '.bg-gradient': {
          backgroundImage: [
            'linear-gradient(to right, rgba(37, 99, 235, 0.05), rgba(147, 51, 234, 0.15))',
            'linear-gradient(to bottom right, rgba(219, 234, 254, 0.4), rgba(237, 233, 254, 0.4))'
          ].join(', '),
          backdropFilter: 'blur(4px)',
          position: 'relative',
        },
        '.bg-button': {
          backgroundImage: 'linear-gradient(to right, #2563EB, #9333EA)',
          color: 'white',
        },
        '.bg-button:hover': {
          backgroundImage: 'linear-gradient(to right, #60A5FA, #C084FC)'
        },
        '.text-main': {
          color: '#1D4ED8'
        }
      })
    })
  ]
}
