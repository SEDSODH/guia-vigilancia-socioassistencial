import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        institucional: {
          DEFAULT: 'hsl(var(--institucional-blue))',
          blue: 'hsl(var(--institucional-blue))',
          'blue-foreground': 'hsl(var(--institucional-blue-foreground))',
          lightBlue: 'hsl(var(--institucional-lightBlue))',
          'lightBlue-foreground': 'hsl(var(--institucional-lightBlue-foreground))',
          green: 'hsl(var(--institucional-green))',
          'green-foreground': 'hsl(var(--institucional-green-foreground))',
          lightGreen: 'hsl(var(--institucional-lightGreen))',
          'lightGreen-foreground': 'hsl(var(--institucional-lightGreen-foreground))',
          dark: '#1e293b',
          'dark-foreground': '#f8fafc',
          gray: '#f8fafc',
          'gray-foreground': '#1e293b',
        },

        // Block accent colors — dinâmicas via [data-color-blind] overrides
        'block-gestao':              'hsl(var(--block-gestao))',
        'block-gestao-light':        'hsl(var(--block-gestao-light))',
        'block-gestao-text':         'hsl(var(--block-gestao-text))',
        'block-planejamento':        'hsl(var(--block-planejamento))',
        'block-planejamento-light':  'hsl(var(--block-planejamento-light))',
        'block-planejamento-text':   'hsl(var(--block-planejamento-text))',
        'block-reprogramacao':       'hsl(var(--block-reprogramacao))',
        'block-reprogramacao-light': 'hsl(var(--block-reprogramacao-light))',
        'block-reprogramacao-text':  'hsl(var(--block-reprogramacao-text))',
        'block-controle':            'hsl(var(--block-controle))',
        'block-controle-light':      'hsl(var(--block-controle-light))',
        'block-controle-text':       'hsl(var(--block-controle-text))',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
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
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'progress-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'card-hover': {
          from: { transform: 'scale(1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
          to: { transform: 'scale(1.02)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.15)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-scale': 'fade-in-scale 0.6s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        'progress-pulse': 'progress-pulse 2s ease-in-out infinite',
        'card-hover': 'card-hover 0.3s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
