import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark:    '#0D0F1A',
        card:    '#161826',
        card2:   '#1E2138',
        border:  '#2A2E4A',
        muted:   '#8890BB',
        pink:    '#FF4FA3',
        cyan:    '#00D4FF',
        accent:  '#C8006A',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
      },
    },
  },
  plugins: [],
}
export default config
