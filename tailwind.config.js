module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
      purgeLayersByDefault: true,
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#333',
        gray: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
      },
      fontFamily: {
        raleway: ["Raleway", 'sans serif']
      },
      rotate: {
        '3': '3deg',
        '-3': '-3deg'
      }
    },
  },
  variants: {},
  plugins: [],
}
