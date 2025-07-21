const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath: "/", // <- no more /e-klas/
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8085",
        changeOrigin: true,
      },
    },
  },
});
