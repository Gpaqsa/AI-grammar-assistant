import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { ink: "#172033", accent: "#6558e8" }, boxShadow: { soft: "0 18px 55px rgba(31, 41, 75, .09)" } } },
  plugins: [],
};
export default config;
