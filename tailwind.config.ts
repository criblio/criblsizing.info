import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        serif: [
          "Ubuntu Mono",
        ]
      }
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        cribl: {
          extend: "light",
          colors: {
            secondary: {
              100: "#C9FCEA",
              200: "#95F9DF",
              300: "#5FEFD6",
              400: "#38E0D1",
              500: "#00CCCC",
              600: "#00A0AF",
              700: "#007992",
              800: "#005776",
              900: "#003F61",
              DEFAULT: "#00CCCC"
            },
            // secondary: {
            //   100: "#EFF5F9",
            //   200: "#E0ECF3",
            //   300: "#C3D1DD",
            //   400: "#A0AEBB",
            //   500: "#73808F",
            //   600: "#54647A",
            //   700: "#394A66",
            //   800: "#243352",
            //   900: "#162244",
            //   DEFAULT: "#73808F"
            // },
            // success: {
            //   100: "#CFFFCC",
            //   200: "#99FF9C",
            //   300: "#66FF7A",
            //   400: "#3FFF6C",
            //   500: "#00ff55",
            //   600: "#00DB5E",
            //   700: "#00B761",
            //   800: "#00935C",
            //   900: "#007A59",
            //   DEFAULT: "#00ff55"
            // },
            // default: {
            //   100: "#CDECFD",
            //   200: "#9BD6FB",
            //   300: "#68B7F3",
            //   400: "#4298E8",
            //   500: "#0b6cd9",
            //   600: "#0853BA",
            //   700: "#053E9C",
            //   800: "#032B7D",
            //   900: "#021E68",
            //   DEFAULT: "#73808F"
            // },
            // warning: {
            //   100: "#FFF9CC",
            //   200: "#FFF199",
            //   300: "#FFE866",
            //   400: "#FFDE3F",
            //   500: "#ffcf00",
            //   600: "#DBAD00",
            //   700: "#B78D00",
            //   800: "#936F00",
            //   900: "#7A5900",
            //   DEFAULT: "#ffcf00"
            // },
            // danger: {
            //   100: "#FFE1D6",
            //   200: "#FFBDAD",
            //   300: "#FF9184",
            //   400: "#FF6866",
            //   500: "#FF3342",
            //   600: "#DB2543",
            //   700: "#B71941",
            //   800: "#93103D",
            //   900: "#7A093A",
            //   DEFAULT: "#FF3342"
            // }
          },
        }
      }
    }),
  ],
};
export default config;
