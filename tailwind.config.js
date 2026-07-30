/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'zelena-primarna': '#639922',
        'zelena-tamna': '#27500A',
        'zelena-svetla': '#EAF3DE',
        'amber-akcenat': '#EF9F27',
        'amber-svetla': '#FAEEDA',
        'tekst-primarni': '#27500A',
        'tekst-sekundarni': '#4A7A28',
        'tekst-blagi': '#6B8F58',
        'pozadina': '#FFFFFF',
        'pozadina-surface': '#F5F9F0',
        'pozadina-kartica': '#EAF3DE',
        'pozadina-hover': '#E0EDD4',
        'ivica': '#C8DEB8',
        'ivica-blaga': '#DCE8CC',
      },
    },
  },
  plugins: [],
};
