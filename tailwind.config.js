module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Work Sans"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      boxShadow: {
        menu: "0px 4px 20px rgba(2, 20, 67, 0.12)",
        1: "0px 0px 2px rgba(0, 0, 0, 0.14), 0px 2px 2px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)",
        2: "0px 3px 3px rgba(0, 0, 0, 0.14), 0px 3px 4px rgba(0, 0, 0, 0.12), 0px 1px 8px rgba(0, 0, 0, 0.2)",
      },
      colors: {
        discord: {
          blurple: "#5865F2",
        },
        light: {
          // TODO I don't like theses names because token names shouldn't
          // dictate how they're used, and it's difficult to figure out the
          // relative values each value
          type: "rgba(0, 0, 0, .87)",
          "type-medium": "rgba(0, 0, 0, .61)",
          "type-low": "rgba(0, 0, 0, .43)",
          "type-disabled": "rgba(0, 0, 0, .23)",
          "type-disabled-solid": "#bdbdbd",
          "type-negative": "rgba(255, 255, 255, .87)",
          interactive: "#5f4de7",
          "interactive-fill": "#eceaff",
          "interactive-2-background": "#fafbff",
          "background-shaded": "#f7f7f7",
          border: "rgba(0, 0, 0, .11)",
        },
        brand: {
          highlight: "#EDDA54",
          primary: "#352B90",
          warm: "#E07862",
        },
        warning: {
          light: "#FDECEC",
          dark: "#A01212",
        },
        success: {
          light: "#E9F7F6",
          dark: "#005062",
        },
        black: {
          30: "#fafafb",
          50: "#f0f2f6",
          100: "#cdd3df",
          200: "#97a0b8",
          300: "#535e79",
          400: "#273353",
          500: "#021443",
          700: "#010e34",
          900: "#01061e",
        },
        blue: {
          30: "#f7fafc",
          50: "#e9f3fb",
          100: "#c7e1f5",
          200: "#a2ceef",
          300: "#60abe4",
          400: "#3b98de",
          500: "#1777c1",
          700: "#005495",
          900: "#003f70",
        },
        indigo: {
          30: "#f7fafc",
          50: "#eceaff",
          400: "#8F80FE",
          500: "#5F4DE7",
          850: "#352B90",
        },
        violet: {
          200: "#ddd9ff",
        },
        aqua: {
          30: "#f7fcfc",
          50: "#e9f7f6",
          100: "#c7f5f2",
          200: "#a2e5e3",
          300: "#64cecb",
          400: "#0fbebe",
          500: "#00a1a1",
          700: "#007981",
          900: "#005062",
        },
        yellow: {
          50: "#fffbdc",
          100: "#ffeea0",
          200: "#ffd978",
          300: "#ffc756",
          300: "#edda54",
        },
        magenta: {
          500: "#E10079",
        },
      },
      fill: (theme) => ({
        "black-200": theme("colors.black.200"),
        "light-interactive": theme("colors.light.interactive"),
      }),
      screens: {
        "supports-hover": { raw: "(hover: hover)" },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
