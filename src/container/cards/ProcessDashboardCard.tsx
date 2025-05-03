import { DashboardCard } from "@/components/ui/dashboard-card"
import type { IndicadoresProcesso } from "@/types/Processo"
import {
  AssessmentOutlined,
  CategoryOutlined,
  EngineeringOutlined,
  InfoOutlined,
  LabelOutlined,
} from "@mui/icons-material"
import { Box, Button, Skeleton, Stack, Tab, Tabs, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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

const COLORS = ["#1565C0", "#00897B", "#6A1B9A", "#546E7A", "#FFB300"]

export function ProcessDashboardCard() {
  const router = useRouter()
  const [tab, setTab] = useState(0)
  const [dados, setDados] = useState<IndicadoresProcesso | null>(null)

  const carregarDados = async () => {
    try {
      const res = await fetch("/api/relatorios/processos-dashboard", {
        cache: "no-store",
      })
      const data = await res.json()
      setDados(data)
    } catch (error) {
      console.error("Erro ao carregar indicadores de processos:", error)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const renderTabContent = () => {
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
        <>
          <Stack spacing={0.5}>
            <Typography variant="body1">Total: {dados.total}</Typography>
            <Typography variant="body1">Criados no mês: {dados.noMes}</Typography>
            <Typography variant="body1">Atrasados: {dados.atrasados}</Typography>
            <Typography variant="body1" sx={{ color: COLORS[0] }}>
              ● Atribuídos a mim: {dados.atribuidosAoUsuario}
            </Typography>
            <Typography variant="body1" sx={{ color: COLORS[1] }}>
              ● Outros processos: {dados.total - dados.atribuidosAoUsuario}
            </Typography>
          </Stack>
        </>
      )) ||
      (tab === 1 && (
        <Stack spacing={0.5}>
          {Object.entries(dados.porStatusInterno).map(([status, qtd]) => (
            <Typography key={status} variant="body2">
              {status}: {qtd}
            </Typography>
          ))}
        </Stack>
      )) ||
      (tab === 2 && dados.topTemas?.length ? (
        <Stack spacing={0.5}>
          {dados.topTemas.map(({ tema, total }) => (
            <Typography key={tema} variant="body2">
              {tema}: {total}
            </Typography>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2">Nenhum tema encontrado</Typography>
      )) ||
      (tab === 3 && (
        <Stack spacing={0.5}>
          {Object.entries(dados.porTipoRequerimento).map(([tipo, qtd]) => (
            <Typography key={tipo} variant="body2">
              {tipo}: {qtd}
            </Typography>
          ))}
        </Stack>
      ))

    const chartContent =
      (tab === 0 && (
        <ResponsiveContainer width="100%" height={200}>
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
              outerRadius="100%"
              labelLine={false}
            >
              {[0, 1].map((index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
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
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="qtd" fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      )) ||
      (tab === 2 && dados.topTemas?.length ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dados.topTemas}>
            <XAxis dataKey="tema" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill={COLORS[2]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="body2">Nenhum tema encontrado</Typography>
      )) ||
      (tab === 3 && Object.keys(dados.porTipoRequerimento).length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={Object.entries(dados.porTipoRequerimento).map(([k, v]) => ({
                name: k,
                value: v,
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {COLORS.map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="body2">Nenhum tipo de requerimento encontrado</Typography>
      ))

    return (
      <Box display="grid" gridTemplateColumns="7fr 5fr" gap={2} alignItems="start">
        <Box>{textContent}</Box>
        <Box display="flex" justifyContent="center">
          {chartContent}
        </Box>
      </Box>
    )
  }

  return (
    <DashboardCard
      sx={{
        height: "100%",
        width: "100%",
        bgcolor: "secondary.light",
        color: "secondary.contrastText",
      }}
    >
      <Box
        width={"100%"}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        <Box width={"100%"}>
          <Stack direction="row" spacing={2} alignItems="center">
            <EngineeringOutlined sx={{ fontSize: 40, color: "secondary.contrastText" }} />
            <DashboardCard.Title>Processos</DashboardCard.Title>
          </Stack>
          <DashboardCard.Description variant="body2">
            Visão geral e indicadores de processos cadastrados no sistema.
          </DashboardCard.Description>

          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<InfoOutlined />} iconPosition="start" label="Resumo" />
            <Tab icon={<AssessmentOutlined />} iconPosition="start" label="Status" />
            <Tab icon={<LabelOutlined />} iconPosition="start" label="Temas" />
            <Tab icon={<CategoryOutlined />} iconPosition="start" label="Tipos" />
          </Tabs>

          <Box
            mt={2}
            width="100%"
            sx={{ backgroundColor: "#FFFFFF44", borderRadius: 1, p: 1 }}
          >
            {renderTabContent()}
          </Box>
        </Box>

        <Box mt={2}>
          <Button
            fullWidth
            sx={{ textTransform: "uppercase" }}
            variant="outlined"
            size="small"
            color="inherit"
            onClick={() => router.push("/dashboard/processos")}
          >
            Ver Processos
          </Button>
        </Box>
      </Box>
    </DashboardCard>
  )
}

export default ProcessDashboardCard
