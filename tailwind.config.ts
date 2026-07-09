import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Nexe — matching nexedigital.es
        base: "#0d1412",     // fondo principal — negro con tinte verde oscuro
        mint: "#2be8a4",     // verde brillante Nexe (acento principal)
        mintdark: "#1db87e", // verde más oscuro para hover
        ink: "#ffffff",      // texto principal
        card: "#131f1a",     // fondo cards
        panel: "#0f1a16",    // fondo panels
        rowalt: "#151f1b",   // fila alterna
        thead: "#0d1714",    // cabecera tabla
        line: "#1e2e28",     // bordes
        muted: "#7a9088",    // texto secundario
        sidebar: "#0b1210",  // sidebar más oscuro
        sidemuted: "#6a8078",// texto sidebar secundario
        danger: "#e74c3c",
        warn: "#f39c12",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
