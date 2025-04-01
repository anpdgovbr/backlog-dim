"src/app/dashboard/page.tsx"

import DashboardAdmin from "@/components/dashboard/DashboardAdmin"
import { Box } from "@mui/material"

export default function DashboardPage() {
  return (
    <Box sx={{ p: 0, m: 0, maxWidth: "lg", margin: "0 auto" }}>
      <DashboardAdmin />
    </Box>
  )
}
