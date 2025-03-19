module.exports = {
  apps: [
    {
      name: "next-app",
      script: "server.js", // Substitua pelo nome correto do seu arquivo de servidor
      watch: true, // Monitora mudanças e reinicia automaticamente
      ignore_watch: ["node_modules", "logs"], // Evita reinícios desnecessários
      instances: 1, // Pode ser "max" para usar todos os núcleos do processador
      exec_mode: "fork", // Modo de execução (fork ou cluster)
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      log_file: "./logs/combined.log", // Log unificado
      out_file: "./logs/out.log", // Logs de saída
      error_file: "./logs/error.log", // Logs de erro
      time: true, // Adiciona timestamps nos logs
    },
  ],
}
