"use client"

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import Assessment from "@mui/icons-material/Assessment"
import AssessmentOutlined from "@mui/icons-material/AssessmentOutlined"
import InfoOutlined from "@mui/icons-material/InfoOutlined"
import LabelOutlined from "@mui/icons-material/LabelOutlined"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Typography from "@mui/material/Typography"

import { BaseDashboardCard } from "@/components/ui/dashboard-card"
import type { IndicadoresProcesso } from "@/types/Processo"

const COLORS = [
  "rgba(255, 255, 255, 1)",
  "rgba(255, 255, 255, 0.9)",
  "rgba(255, 255, 255, 0.75)",
  "rgba(255, 255, 255, 0.85)",
  "rgba(255, 255, 255, 0.7)",
]

/**
 * Componente de dashboard que exibe estatísticas resumidas dos processos.
 *
 * - Renderiza um card com três abas: "Resumo", "Status" e "Temas".
 * - Faz fetch para o endpoint `/api/relatorios/processos-dashboard` ao ser montado
 *   (cache: "no-store") para obter os indicadores exibidos no card.
 * - Enquanto os dados carregam, exibe skeletons; em caso de erro, mostra mensagem
 *   de erro adequada.
 * - Aba "Resumo": mostra totais, criados no mês, atrasados e quantos estão
 *   atribuídos ao usuário.
 * - Aba "Status": lista a contagem por status interno e apresenta um gráfico de barras.
 * - Aba "Temas": exibe os temas mais frequentes e um gráfico correspondente.
 *
 * Observações:
 * - Não recebe props; utiliza roteamento via `useRouter` para ação do botão.
 * - Retorna um JSX.Element representando o card com gráficos (recharts) e MUI.
 *
 * @returns JSX.Element - Card com estatísticas e gráficos interativos.
 */
export function StatsDashboardCard() {
  const router = useRouter()
  const [tab, setTab] = useState(0)
  const [dados, setDados] = useState<IndicadoresProcesso | null>(null)
  const [erro, setErro] = useState(false)

  const carregarDados = async () => {
    try {
      const res = await fetch("/api/relatorios/processos-dashboard", {
        cache: "no-store",
      })

      if (!res.ok) {
        setErro(true)
        console.warn("Erro ao buscar indicadores:", res.status)
        return
      }

      const data = await res.json()
      if (typeof data !== "object" || !data.total) {
        console.warn("Formato inesperado da resposta:", data)
        setErro(true)
        return
      }

      setDados(data)
    } catch (error) {
      console.error("Erro ao carregar indicadores de processos:", error)
      setErro(true)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const renderTabContent = () => {
    if (erro) {
      return (
        <Typography variant="body2" color="error">
          Não foi possível carregar os dados de estatísticas. Verifique se você está
          autenticado.
        </Typography>
      )
    }

    if (!dados) {
      return (
        <Stack spacing={1}>
          <Skeleton height={24} width="60%" />
          <Skeleton height={20} width="40%" />
          <Skeleton height={20} width="50%" />
        </Stack>
      )
    }

    const textContent =
      (tab === 0 && (
        <Stack spacing={0.5}>
          <Typography variant="body2" sx={{ color: COLORS[0], fontWeight: 600 }}>
            Total: {dados.total}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS[1] }}>
            Criados no mês: {dados.noMes}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS[1] }}>
            Atrasados: {dados.atrasados}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS[0], fontWeight: 700 }}>
            ● Atribuídos a mim: {dados.atribuidosAoUsuario}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS[2] }}>
            ● Outros processos: {dados.total - dados.atribuidosAoUsuario}
          </Typography>
        </Stack>
      )) ||
      (tab === 1 && (
        <Stack spacing={0.5}>
          {Object.entries(dados.porStatusInterno).map(([status, qtd]) => (
            <Typography
              key={status}
              variant="body2"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box component="span" sx={{ color: COLORS[0], fontWeight: 600 }}>
                {status}
              </Box>
              <Box component="span" sx={{ color: COLORS[2], fontWeight: 700 }}>
                {qtd}
              </Box>
            </Typography>
          ))}
        </Stack>
      )) ||
      (tab === 2 && dados.topTemas?.length ? (
        <Stack spacing={0.5}>
          {dados.topTemas.map(({ tema, total }) => (
            <Typography
              key={tema}
              variant="body2"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box component="span" sx={{ color: COLORS[1], fontWeight: 600 }}>
                {tema}
              </Box>
              <Box component="span" sx={{ color: COLORS[2], fontWeight: 700 }}>
                {total}
              </Box>
            </Typography>
          ))}
        </Stack>
      ) : (
        <Box>
          <Typography variant="body2" sx={{ color: COLORS[1], fontWeight: 600 }}>
            Nenhum tema encontrado
          </Typography>
        </Box>
      ))

    const chartContent =
      (tab === 0 && (
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={[
                { name: "Atribuídos a mim", value: dados.atribuidosAoUsuario },
                {
                  name: "Outros processos",
                  value: dados.total - dados.atribuidosAoUsuario,
                },
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              labelLine={false}
            >
              {[0, 1].map((index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.72)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: COLORS[0],
              }}
              labelStyle={{ color: COLORS[0] }}
              itemStyle={{ color: COLORS[0] }}
            />
          </PieChart>
        </ResponsiveContainer>
      )) ||
      (tab === 1 && (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={Object.entries(dados.porStatusInterno).map(([k, v]) => ({
              status: k,
              qtd: v,
            }))}
          >
            <XAxis dataKey="status" stroke={COLORS[0]} tick={{ fill: COLORS[2] }} />
            <YAxis stroke={COLORS[0]} tick={{ fill: COLORS[2] }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.72)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              labelStyle={{ color: COLORS[0] }}
              itemStyle={{ color: COLORS[0] }}
            />
            <Legend wrapperStyle={{ color: COLORS[0] }} />
            <Bar dataKey="qtd" fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      )) ||
      (tab === 2 && dados.topTemas?.length ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dados.topTemas}>
            <XAxis dataKey="tema" stroke={COLORS[0]} tick={{ fill: COLORS[2] }} />
            <YAxis stroke={COLORS[0]} tick={{ fill: COLORS[2] }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.72)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              labelStyle={{ color: COLORS[0] }}
              itemStyle={{ color: COLORS[0] }}
            />
            <Legend wrapperStyle={{ color: COLORS[0] }} />
            <Bar dataKey="total" fill={COLORS[2]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Box>
          <Typography variant="body2" sx={{ color: COLORS[1], fontWeight: 600 }}>
            Nenhum tema encontrado
          </Typography>
        </Box>
      ))

    return (
      <Box display="grid" gridTemplateColumns="7fr 5fr" gap={2} alignItems="start">
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            bgcolor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {textContent}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            p: 1.5,
            borderRadius: 1,
            bgcolor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {chartContent}
        </Box>
      </Box>
    )
  }

  const actionButton = (
    <Button
      fullWidth
      variant="contained"
      size="large"
      onClick={() => router.push("/dashboard/processos")}
      sx={{
        /* tornar o botão um pouco mais discreto */
        bgcolor: "rgba(0, 0, 0, 0.12)",
        color: "warning.contrastText",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 0, 0, 0.3)",
        "&:hover": {
          bgcolor: "rgba(0, 0, 0, 0.18)",
        },
      }}
    >
      Ver Processos
    </Button>
  )

  return (
    <BaseDashboardCard
      icon={<Assessment />}
      title="Estatísticas"
      subtitle="Relatórios e Métricas"
      description="Veja relatórios e métricas do processamento de dados."
      color="warning"
      actionButton={actionButton}
    >
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{
          minHeight: 36,
          "& .MuiTab-root": {
            color: "rgba(255,255,255,0.75)",
            opacity: 0.85,
            minHeight: 36,
            py: 0.5,
          },
          "& .Mui-selected": {
            color: "rgba(255,255,255,1)",
            opacity: 1,
            fontWeight: 700,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "rgba(255,255,255,0.95)",
            height: 3,
            borderRadius: 4,
          },
        }}
      >
        <Tab
          icon={<InfoOutlined />}
          iconPosition="start"
          label="Resumo"
          sx={{ minHeight: 32, py: 0.5 }}
        />
        <Tab
          icon={<AssessmentOutlined />}
          iconPosition="start"
          label="Status"
          sx={{ minHeight: 32, py: 0.5 }}
        />
        <Tab
          icon={<LabelOutlined />}
          iconPosition="start"
          label="Temas"
          sx={{ minHeight: 32, py: 0.5 }}
        />
      </Tabs>

      <Box mt={2} width="100%">
        {renderTabContent()}
      </Box>
    </BaseDashboardCard>
  )
}

export default StatsDashboardCard
