const plugins = {
  "postcss-import": {},
  tailwindcss: {},
  autoprefixer: {},
};

if (process.env.NODE_ENV === "production") {
  // Minify CSS
  plugins.cssnano = {
    preset: "default",
  };
}

module.exports = {
  plugins,
};
