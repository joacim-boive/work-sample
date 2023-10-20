const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "2ezbxw",

  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {},
    supportFile: false,
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
