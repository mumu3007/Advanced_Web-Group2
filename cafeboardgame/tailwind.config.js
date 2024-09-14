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
        'orangePro' : '#FF4A00',
        'bgPro' : '#F4F1EC',
        'formfPro' : 'rgba(210, 9, 28, 0.7)',
      },
      animation: {
        closedrop: 'closedrop 1s ease-in-out 1',
      },
      keyframes: {
        closedrop: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-100px)' },
        }
      }
    },
  },
  plugins: [],
};
