/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0050cb",
        "primary-container": "#0066ff",
        "primary-fixed": "#dae1ff",
        "primary-fixed-dim": "#b3c5ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#f8f7ff",
        "on-primary-fixed": "#001849",
        "on-primary-fixed-variant": "#003fa4",
        "inverse-primary": "#b3c5ff",

        "secondary": "#515f78",
        "secondary-container": "#d2e0fe",
        "secondary-fixed": "#d6e3ff",
        "secondary-fixed-dim": "#b9c7e4",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#55637d",
        "on-secondary-fixed": "#0d1c32",
        "on-secondary-fixed-variant": "#39475f",

        "tertiary": "#a33200",
        "tertiary-container": "#cc4204",
        "tertiary-fixed": "#ffdbd0",
        "tertiary-fixed-dim": "#ffb59d",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fff6f4",
        "on-tertiary-fixed": "#390c00",
        "on-tertiary-fixed-variant": "#832600",

        "background": "#faf8ff",
        "on-background": "#191b24",

        "surface": "#faf8ff",
        "surface-bright": "#faf8ff",
        "surface-dim": "#d8d9e6",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#ecedfa",
        "surface-container-high": "#e6e7f4",
        "surface-container-highest": "#e1e2ee",
        "surface-variant": "#e1e2ee",
        "surface-tint": "#0054d6",
        "on-surface": "#191b24",
        "on-surface-variant": "#424656",
        "inverse-surface": "#2e303a",
        "inverse-on-surface": "#eff0fd",

        "outline": "#727687",
        "outline-variant": "#c2c6d8",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        "cyan-live": "#00ffff",
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "md": "1.5rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      spacing: {
        "container-max": "1280px",
        "unit": "8px",
        "margin-mobile": "16px",
        "gutter": "24px",
        "margin-desktop": "40px"
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "headline": ["Inter", "sans-serif"],
        "label": ["Space Grotesk", "sans-serif"],
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "headline-lg-mobile": ["28px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
        "headline-xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }]
      },
      boxShadow: {
        "glass": "0 4px 24px rgba(0, 80, 203, 0.08)",
        "glass-lg": "0 10px 40px rgba(0, 80, 203, 0.12)",
        "glow-primary": "0 0 20px rgba(0, 102, 255, 0.45)",
        "glow-cyan": "0 0 15px rgba(0, 255, 255, 0.4)",
      }
    },
  },
  plugins: [],
}
