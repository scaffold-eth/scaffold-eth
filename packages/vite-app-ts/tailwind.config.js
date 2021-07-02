module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  important: false,
  theme: {
    extend: {
      extend: {
        /**
         *  added the default spacing values to max width
         * @param theme
         */
        maxWidth: (theme) => ({
          ...theme('spacing'),
        }),
        minWidth: (theme) => ({
          ...theme('spacing'),
        }),
        backgroundColor: ['group-focus'],
        borderWidth: {
          1: '1px',
        },
      },
    },
  },
  variants: {
    extend: {
      // ...
      borderWidth: ['hover', 'focus'],
    },
  },
  plugins: [],
};
