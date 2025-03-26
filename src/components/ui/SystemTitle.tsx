import { Link, Typography } from "@mui/material"

import Version from "./Version"

export default function SystemTitle() {
  return (
    <Typography
      variant="h4"
      component="h1"
      fontWeight={700}
      letterSpacing={0.75}
      sx={{ color: "primary.contrastText", textAlign: "center" }}
    >
      <Link
        href="/dashboard"
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Processamento Backlog DIM{" "}
        <Typography
          variant="caption"
          component="sup"
          fontWeight={500}
          sx={{ opacity: 0.8 }}
        >
          Alfa <Version />
        </Typography>
      </Link>
    </Typography>
  )
}
