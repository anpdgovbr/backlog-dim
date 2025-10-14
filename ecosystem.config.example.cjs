/**
 * ============================================================
 *  ANPD / DDSS - Backlog-DIM (Next.js)
 *  Arquivo de configuração do PM2 (EXEMPLO)
 *  Última revisão: 2025-10-13
 * ============================================================
 *
 * INSTRUÇÕES:
 * 1. Copie este arquivo para `ecosystem.config.cjs`
 * 2. Ajuste as variáveis de ambiente conforme seu ambiente
 * 3. Certifique-se que o arquivo .env.production existe
 * 4. Execute: pm2 start ecosystem.config.cjs --env production
 */

// @ts-check
/* eslint-env node */
/* eslint-disable no-undef */

const path = require("path")
const pkg = require("./package.json")

module.exports = {
  apps: [
    {
      /**
       * Nome e contexto do app
       */
      name: "backlog-dim",
      cwd: path.resolve(__dirname),

      /**
       * Script de inicialização
       * ------------------------------------------------------------
       * Usa o server standalone (gerado por `npm run build`)
       * Isso garante menor overhead e versão correta no PM2.
       */
      script: "node",
      args: ".next/standalone/server.js",

      /**
       * Execução e performance
       * ------------------------------------------------------------
       */
      instances: 1, // 1 processo; use "max" para modo cluster
      exec_mode: "fork", // "fork" = simples; "cluster" = multi-core
      watch: false, // nunca em produção
      autorestart: true, // reinicia em crash
      max_memory_restart: "1G", // reinicia se ultrapassar 1GB de RAM

      /**
       * Variáveis de ambiente
       * ------------------------------------------------------------
       * .env.production é carregado automaticamente,
       * mas mantemos env_production para redundância e clareza.
       */
      env_file: ".env.production",
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
        NEXT_TELEMETRY_DISABLED: "1",

        // URLs públicas e internas
        NEXTAUTH_URL: "https://dim.dev.anpd.gov.br",
        NEXTAUTH_TRUST_HOST: "true",

        // API: comunicação interna (loopback) e externa
        CONTROLADORES_API_URL: "http://127.0.0.1:4000",
        NEXT_PUBLIC_CONTROLADORES_API_URL:
          "https://controlador-api.dev.anpd.gov.br",

        // Confiar na CA interna e do sistema operacional
        NODE_OPTIONS: "--use-openssl-ca",
        NODE_EXTRA_CA_CERTS: "/etc/ssl/certs/anpd-root-ca.pem",
      },

      /**
       * Logs e formatação
       * ------------------------------------------------------------
       */
      error_file: "logs/backlog-error.log",
      out_file: "logs/backlog-out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      time: true,

      /**
       * Política de reinício progressiva
       * ------------------------------------------------------------
       */
      max_restarts: 5,
      restart_delay: 2000,
      exp_backoff_restart_delay: 2000,

      /**
       * Versão exibida no PM2
       * ------------------------------------------------------------
       * Mostra a versão real do app (do seu package.json).
       */
      version: pkg.version,
    },
  ],
}
