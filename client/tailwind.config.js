module.exports = {
  content: [
    './src/pages/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '1/5': '1fr 5fr',
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
