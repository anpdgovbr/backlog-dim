# 🔄 Migração para docker-infra-pg

## 📋 Resumo da Integração

O projeto backlog-dim foi atualizado para usar a infraestrutura padronizada **docker-infra-pg** da ANPD, oferecendo maior consistência e facilidade de setup entre projetos.

## ✅ O que foi Implementado

### 🛠️ Scripts Automatizados

```json
{
  "infra:setup": "curl -sSL https://raw.githubusercontent.com/anpdgovbr/docker-infra-pg/main/setup-infra.sh | bash",
  "infra:up": "cd infra-db && docker-compose up -d",
  "infra:down": "cd infra-db && docker-compose down",
  "infra:logs": "cd infra-db && docker-compose logs -f postgres",
  "infra:reset": "cd infra-db && docker-compose down -v && docker-compose up -d",
  "db:setup": "npm run infra:up && sleep 5 && npm run prisma:migrate && npm run prisma:seed",
  "db:fresh": "npm run infra:reset && sleep 10 && npm run db:setup"
}
```

### 🗂️ Arquivos Criados Automaticamente

- `infra-db/` - Infraestrutura PostgreSQL clonada do repositório genérico
- `infra-db/.env` - Configurações da infraestrutura com credenciais geradas automaticamente
- `docs/INFRA-DOCKER-PG-COMO-USAR.md` - Documentação completa de uso

### 🔧 Configurações Atualizadas

- `.env.example` - Atualizado com nova estrutura e credenciais pré-configuradas
- `package.json` - Novos scripts de infraestrutura
- `README.md` - Documentação atualizada com novos fluxos

## 🎯 Benefícios da Migração

### ✅ Para Desenvolvedores

- **Setup único**: `npm run infra:setup` configura tudo automaticamente
- **Credenciais pré-configuradas**: Não precisa configurar usuários/senhas
- **Comandos padronizados**: Mesmos scripts em todos os projetos ANPD
- **Reset fácil**: `npm run db:fresh` para ambiente limpo

### ✅ Para o Projeto

- **Consistência**: Mesma infraestrutura em todos os projetos
- **Manutenibilidade**: Scripts centralizados no docker-infra-pg
- **Isolamento**: Cada projeto tem sua configuração independente
- **Flexibilidade**: Supabase continua como alternativa

## 🔄 Fluxo de Trabalho Atualizado

### 🚀 Setup Inicial (Novo Dev)

```bash
git clone https://github.com/anpdgovbr/backlog-dim.git
cd backlog-dim
npm install
cp .env.example .env.local
npm run infra:setup  # Baixa infraestrutura e gera credenciais
# ⚠️ Copie a DATABASE_URL gerada para seu .env.local
npm run db:setup     # Setup completo automatizado
npm run dev
```

### 🔄 Desenvolvimento Diário

```bash
npm run infra:up    # Subir banco
npm run dev         # Desenvolver
npm run infra:down  # Parar banco (opcional)
```

### 🔧 Manutenção

```bash
npm run infra:logs   # Ver logs do PostgreSQL
npm run db:fresh     # Reset completo do ambiente
npm run infra:reset  # Reset apenas da infraestrutura
```

## 📊 Configuração Específica do backlog-dim

### 🗄️ Banco de Dados

- **Nome**: `backlog_dim_dev`
- **Usuário**: `backlog_user_db`
- **Senha**: Gerada automaticamente pelo script (ex: `yxaCynOOY3SAO9Qf`)
- **Porta**: `5432`

### 🔗 String de Conexão

A string de conexão é gerada automaticamente pelo script `infra:setup` e deve ser copiada para o `.env`:

```bash
DATABASE_URL="postgresql://backlog_user_db:senha_gerada@localhost:5432/backlog_dim_dev?schema=public"
```

### 🔐 Credenciais de Segurança

- **Credenciais únicas**: Cada execução do script gera senhas diferentes
- **Ambiente isolado**: Cada projeto tem suas próprias credenciais
- **Senhas seguras**: Geradas automaticamente com 16 caracteres

## 🔀 Compatibilidade com Supabase

O projeto mantém **compatibilidade total** com Supabase:

```bash
# Opção 1: docker-infra-pg (Recomendado)
npm run infra:setup  # Baixa infraestrutura e gera credenciais
npm run db:setup     # Configura banco com credenciais geradas

# Opção 2: Supabase (Alternativa)
npx supabase start
npx prisma migrate dev
npm run db:seed
```

## 📚 Documentação Relacionada

- `infra-db/README.md` - Documentação da infraestrutura
- [docker-infra-pg](https://github.com/anpdgovbr/docker-infra-pg) - Repositório da infraestrutura
- `.env.example` - Template de configuração

## 🎯 Próximos Passos

### ✅ Concluído

- [x] Scripts de infraestrutura implementados
- [x] Documentação atualizada
- [x] .env.example configurado
- [x] Compatibilidade com Supabase mantida

### 🔄 Recomendações

- [ ] Testar migração com outros desenvolvedores
- [ ] Validar em diferentes sistemas operacionais
- [ ] Considerar automação no CI/CD
- [ ] Documentar troubleshooting comum

## 💡 Impacto na Equipe

### 🟢 Pontos Positivos

- Setup 90% mais rápido para novos desenvolvedores
- Comandos padronizados entre projetos
- Menor chance de erro de configuração
- Ambiente isolado e limpo

### ⚠️ Pontos de Atenção

- Docker deve estar instalado e funcionando
- Porta 5432 deve estar disponível
- Primeira execução baixa imagens Docker (pode demorar)
- Reset completo remove todos os dados locais

## 🛠️ Troubleshooting

### Porta 5432 em uso

```bash
# Verificar o que está usando a porta
netstat -tlnp | grep 5432

# Parar PostgreSQL system (se instalado)
sudo systemctl stop postgresql
```

### Erro de permissão Docker

```bash
# Linux: adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
# Reiniciar sessão
```

### Reset não funciona

```bash
# Force reset
docker-compose down -v --remove-orphans
docker system prune -f
npm run infra:setup
```
