import CardMedia from "@mui/material/CardMedia"
import type { SxProps } from "@mui/material/styles"

interface DashboardCardMediaProps {
  imgSrc: string
  alt: string
  height?: number
  sx?: SxProps
}

export function DashboardCardMedia({
  imgSrc,
  alt,
  height,
  sx,
}: Readonly<DashboardCardMediaProps>) {
  return (
    <CardMedia
      component="img"
      image={imgSrc}
      alt={alt}
      loading="lazy"
      sx={{
        objectFit: "contain",
        height: height,
        maxHeight: "80%",
        width: "auto",
        marginBottom: 1,
        ...sx,
      }}
    />
  )
}
