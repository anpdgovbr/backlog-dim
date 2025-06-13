"use client"

import ImportarDashboardCard from "@/container/cards/ImportarDashboardCard"
import MetadadosDashboardCard from "@/container/cards/MetadadosDashboardCard"
import ProcessDashboardCard from "@/container/cards/ProcessDashboardCard"
import RequeridosDashboardCard from "@/container/cards/RequeridosDashboardCard"
import ResponsaveisDashboardCard from "@/container/cards/ResponsaveisDashboardCard"
import StatsDashboardCard from "@/container/cards/StatsDashboardCard"
import { Grid } from "@mui/material"

export default function SobrePage() {
  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {/* ===== Processos (principal) ===== */}

      <Grid size={{ xs: 12, md: 6 }} component="div">
        <ProcessDashboardCard />
      </Grid>

      {/* ===== Estatísticas ===== */}

      <Grid size={{ xs: 12, md: 6 }} component="div">
        <StatsDashboardCard />
      </Grid>

      {/* ===== Metadados ===== 
      ajustar futuramente
      */}

      <Grid container spacing={2} columns={12} size={{ xs: 12, sm: 6, md: 4 }}>
        <Grid size={{ xs: 12 }} component="div">
          <MetadadosDashboardCard />
        </Grid>
        <Grid size={{ xs: 12 }} component="div">
          <ImportarDashboardCard />
        </Grid>
      </Grid>

      {/* ===== Responsáveis ===== */}

      <Grid size={{ xs: 12, sm: 6, md: 4 }} component="div">
        <ResponsaveisDashboardCard />
      </Grid>

      {/* ===== Requeridos ===== */}

      <Grid size={{ xs: 12, sm: 6, md: 4 }} component="div" minWidth={0}>
        <RequeridosDashboardCard />
      </Grid>
    </Grid>
  )
}
