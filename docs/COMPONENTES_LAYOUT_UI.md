# Componentes de Layout e UI

Este documento descreve os novos componentes de layout e UI criados para melhorar a reutilização e consistência visual do sistema.

## Componentes de Layout

### DashboardLayout

**Layout de conteúdo para páginas dentro do dashboard** - não inclui Container, breadcrumb ou navegação (já fornecidos pelo `app/dashboard/layout.tsx`).

```tsx
import { DashboardLayout } from "@/components/layouts"
;<DashboardLayout
  title="Título da Página"
  subtitle="Descrição da página"
  loading={false}
  loadingMessage="Carregando..."
  actions={<Button>Ações</Button>}
  hasSidebar={false}
  sidebar={<Sidebar items={items} />}
>
  {/* Conteúdo da página */}
</DashboardLayout>
```

**Props:**

- `title?: string` - Título da página
- `subtitle?: string` - Subtítulo/descrição
- `loading?: boolean` - Estado de carregamento
- `loadingMessage?: string` - Mensagem durante carregamento
- `actions?: React.ReactNode` - Botões/ações do cabeçalho
- `hasSidebar?: boolean` - Se tem sidebar lateral
- `sidebar?: React.ReactNode` - Conteúdo da sidebar

**⚠️ Importante:** Este componente deve ser usado apenas dentro de rotas `/dashboard/*` pois depende da estrutura fornecida pelo layout de dashboard do App Router.

### PageLayout

Layout para páginas institucionais com header customizável.

```tsx
import { PageLayout, PageSection } from "@/components/layouts"
;<PageLayout
  maxWidth="lg"
  header={{
    title: "Título da Página",
    subtitle: "ANPD",
    description: "Descrição da página",
    variant: "institutional", // "default" | "institutional" | "hero"
    actions: <Button>Ação</Button>,
  }}
>
  <PageSection title="Seção 1" elevation={1}>
    {/* Conteúdo */}
  </PageSection>
</PageLayout>
```

### CardGrid

Grid responsivo para organizar cards em dashboards.

```tsx
import { CardGrid, DashboardSection } from "@/components/layouts"
;<DashboardSection
  title="Seção"
  subtitle="Descrição"
  actions={<Button>Ver todos</Button>}
>
  <CardGrid columns={{ xs: 12, sm: 6, md: 4 }} minCardHeight={280}>
    <Card1 />
    <Card2 />
    <Card3 />
  </CardGrid>
</DashboardSection>
```

## Componentes UI

### Sidebar

Menu lateral com design institucional e suporte a mobile.

```tsx
import { Sidebar } from "@/components/ui"

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    onClick: () => router.push("/dashboard")
  },
  // ...
]

<Sidebar
  title="Menu Principal"
  items={menuItems}
  defaultOpen={true}
  width={280}
/>
```

### StatusChip

Chip para exibir status com cores e ícones padronizados.

```tsx
import StatusChip from "@/components/ui/StatusChip"
;<StatusChip
  status="success" // "success" | "error" | "warning" | "info" | "pending" | "default"
  text="Ativo"
  showIcon={true}
/>
```

### MetricCard

Card para exibir métricas com indicadores de tendência.

```tsx
import MetricCard from "@/components/ui/MetricCard"
;<MetricCard
  title="Total de Processos"
  value={1247}
  subtitle="Este mês"
  icon={<ProcessIcon />}
  trend={{ value: 12, label: "vs mês anterior" }}
  color="primary"
/>
```

## Cards de Dashboard Melhorados

Todos os dashboard cards foram atualizados com:

- **Cores temáticas**: Cada card usa cores específicas do tema ANPD
- **Efeitos visuais**: Elementos decorativos e efeitos glass/blur
- **Melhor contraste**: Textos legíveis sobre fundos coloridos
- **Botões consistentes**: Botões com estilo unificado
- **Layout estruturado**: Headers, conteúdo e ações bem organizados

### ProcessDashboardCard

- Cor: `primary.main` (Verde ANPD)
- Cards internos com métricas em glass effect
- Status chips translúcidos

### StatsDashboardCard

- Cor: `warning.main` (Laranja ANPD)
- Tabs estilizadas para o fundo colorido
- Botão com contraste adequado

### MetadadosDashboardCard

- Cor: `info.main` (Azul ANPD)
- Layout simplificado e elegante

### RequeridosDashboardCard

- Cor: `secondary.main` (Azul secundário)
- Cards internos com backdrop blur

### ResponsaveisDashboardCard

- Cor: `success.main` (Verde sucesso)
- Grid de responsáveis com transparência

### ImportarDashboardCard

- Cor: `accent.main` (Laranja accent)
- Design focado na ação de upload

## Melhorias Implementadas

1. **Visibilidade**: Todos os componentes agora têm contraste adequado
2. **Consistência**: Padrão visual unificado em todos os cards
3. **Reutilização**: Componentes de layout podem ser usados em diferentes páginas
4. **Responsividade**: Layouts adaptáveis para diferentes tamanhos de tela
5. **Acessibilidade**: Cores e contrastes seguindo padrões de acessibilidade
6. **Performance**: Componentes otimizados com carregamento condicional

## Exemplo de Uso Completo

```tsx
import { DashboardLayout, CardGrid, DashboardSection } from "@/components/layouts"
import { Sidebar, StatusChip, MetricCard } from "@/components/ui"

export default function ExamplePage() {
  return (
    <DashboardLayout
      title="Exemplo Dashboard"
      subtitle="Demonstração dos novos componentes"
    >
      <DashboardSection title="Métricas" subtitle="Indicadores principais">
        <CardGrid columns={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Total" value={1247} color="primary" trend={{ value: 12 }} />
          <MetricCard title="Ativos" value={980} color="success" trend={{ value: -5 }} />
          {/* Mais cards... */}
        </CardGrid>
      </DashboardSection>
    </DashboardLayout>
  )
}
```
