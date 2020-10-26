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
