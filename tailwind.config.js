/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        'custom-white': '#fcfffe',
        'custom-green1': '#e4fbf3',
        'custom-green2': '#23ca86',
        'custom-green3': '#079e6a',
        'custom-green4': '#04463e',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        themeCovoit: {
          'neutral': '#fcfffe',
          'accent': '#23ca86',
          'secondary': '#C9F1DE',
          'base-100': '#079e6a',
          'primary': '#04463e',
        },
        themeCovoitdark: {
          'neutral': '#29252c',
          'accent': '#36485e',
          'secondary': '#333146',
          'base-100': '#fcfffe',
          'primary': '#9effa9',
        },
      },
    ],
  },
};
