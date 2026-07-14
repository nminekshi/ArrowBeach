import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './data/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#eef8fb',
          100: '#d7f0f7',
          200: '#b0dfea',
          300: '#7bc7dc',
          400: '#43acc9',
          500: '#1f8fb1',
          600: '#176d8b',
          700: '#165970',
          800: '#164a5d',
          900: '#173e4d',
        },
        sand: {
          50: '#fcfaf6',
          100: '#f7f1e7',
          200: '#ecdfc8',
          300: '#dec8a2',
          400: '#cfab73',
          500: '#c08e52',
          600: '#b17644',
          700: '#916037',
          800: '#744d31',
          900: '#5f402c',
        },
        night: '#221913',
      },
      boxShadow: {
        luxury: '0 20px 60px rgba(34, 25, 19, 0.12)',
        glow: '0 0 0 1px rgba(255,255,255,0.25), 0 24px 80px rgba(31, 143, 177, 0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(15, 54, 75, 0.88), rgba(26, 36, 44, 0.58) 55%, rgba(233, 214, 184, 0.18))',
        'section-gradient': 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,244,234,0.92))',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
};

export default config;
