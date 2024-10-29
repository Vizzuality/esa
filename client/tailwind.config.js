/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/containers/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'map-background': 'hsl(var(--map-style-background))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          map: 'var(--card-map)',
        },
        gray: {
          200: 'hsla(60, 8%, 90%, 1)',
          500: 'hsla(202, 15%, 66%, 1)',
          700: '#5A7A8A',
          800: 'hsla(197, 37%, 32%, 1)',
          900: 'hsla(198, 100%, 14%, 1)',
        },
        'enlight-yellow': {
          400: 'hsla(43, 100%, 65%, 1)',
          500: 'hsla(39, 97%, 54%, 1)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '4xl': '2rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'fade-down': {
          '0%': { opacity: 0, transform: 'translateY(0)' },
          '100%': { opacity: 1, transform: 'translateY(20px)' },
        },
        'fade-up': {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(-20px)' },
        },
      },
      animation: {
        'fade-down': 'fade-down 2s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 2s ease-in-out infinite',
      },
      fontFamily: {
        'open-sans': ['var(--font-open-sans)'],
        inter: ['var(--font-inter)'],
        notes: ['var(--font-esa-notes)'],
      },
      backgroundImage: {
        'header-line':
          'linear-gradient(90deg, rgba(0, 174, 157, 0.00) 0%, rgba(0, 174, 157, 0.70) 51.56%, rgba(0, 174, 157, 0.00) 98.43%)',
        'story-header':
          'linear-gradient(180deg, rgba(12, 62, 84, 1) 43.82%, rgba(12, 62, 84, 0.00) 95.85%)',
      },
      screens: {
        '3xl': '1650px',
      },
      boxShadow: {
        filters: '4px 0px 30px 0px hsla(var(--card-foreground))',
        xs: '-4px 0px 4px 0px rgba(160, 160, 160, 0.41) inset',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
