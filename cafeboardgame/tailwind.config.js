module.exports = {
  content: [
    './src/**/*.{html,ts}', // Adjust based on your file structure
  ],
  theme: {
    extend: {
      fontFamily: {
        seymour: ['"Seymour One"', 'sans-serif'], // Add Seymour One font
        koulen: ['"Koulen"', 'cursive']
      },
      colors: {
        'redProject': '#D2091C',
      },
    },
  },
  plugins: [],
};
