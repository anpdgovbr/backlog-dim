module.exports = {
  apps: [
    {
      name: "next-app",
      script: "server.js", // Caminho do seu servidor Next.js
      watch: true,
      ignore_watch: ["node_modules", "logs"],
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      time: true,
    },
  ],
}
