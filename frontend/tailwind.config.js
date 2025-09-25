// tailwind.config.js

module.exports = {
  // ...
  theme: {
    extend: {
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '10%': { opacity: '0.4' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
      },
      animation: {
        fall: 'fall linear infinite',
      },
    },
  },
  plugins: [],
}
