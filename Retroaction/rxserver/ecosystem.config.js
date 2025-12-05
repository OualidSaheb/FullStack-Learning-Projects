export const apps = [
  {
    name: "rxserver",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    watch: true,
    // Delay between restart
    watch_delay: 1000,
    ignore_watch : ["node_modules", "public"],
  },
];