/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0f172a",
        slatePanel: "#e2e8f0",
        actionBlue: "#3b82f6"
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      },
      boxShadow: {
        panel: "0 10px 30px -12px rgba(15,23,42,0.20)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" }
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.5s linear infinite",
        riseIn: "riseIn 0.4s ease-out both"
      }
    }
  },
  plugins: []
};
