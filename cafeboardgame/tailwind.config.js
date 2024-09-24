module.exports = {
  content: [
    './src/**/*.{html,ts}', // Adjust based on your file structure
  ],
  theme: {
    extend: {
      fontFamily: {
        seymour: ['"Seymour One"', 'sans-serif'], // Add Seymour One font
        koulen: ['"Koulen"', 'cursive'],
        noto: ['"Noto Sans Thai"', 'sans-serif'],
        
      },
      colors: {
        'redProject': '#D2091C',
        'orangePro' : '#FF4A00',
        'bgPro' : '#F4F1EC',
        'formfPro' : 'rgba(210, 9, 28, 0.7)',
        'orangeform' : 'rgba(255, 74, 0, 0.8)',
      },
      animation: {
        lefttoright: 'lefttoright 2s ease-in-out 1',
        righttoleft: 'righttoleft 2s ease-in-out 1',
        spining: 'spining 1s ease-in 1',
        opacityfade: 'opacityfade 1s ease-in 1',
      },
      keyframes: {
        opacityfade:{
          '0%':{
            opacity:'0'
          },
          '100%':{
            opacity:'1'
          }
        },
        spining:{
          '0%': { 
            transform: 'translateX(-500px) rotate(-360deg)'
          },
          '100%': { 
            transform: 'translateX(0px) rotate(0deg)'
          },
        },
        lefttoright: {
          '0%': { 
            transform: 'translateX(-500px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0px)',
            opacity: '1'
          },
        },
        righttoleft: {
          '0%': { 
            transform: 'translateX(500px)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0px)',
            opacity: '1'
          },
        },      
       
      }
    },
  },
  plugins: [],
};
