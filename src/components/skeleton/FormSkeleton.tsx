import { Grid, Skeleton } from "@mui/material"

interface FormSkeletonProps {
  numberOfFields?: number
}

export function FormSkeleton({ numberOfFields = 6 }: Readonly<FormSkeletonProps>) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: numberOfFields }).map((_, index) => (
        <Grid
          key={index}
          size={{
            xs: 12,
            sm: 6,
          }}
        >
          <Skeleton variant="rectangular" sx={{ fontSize: "2rem" }} />
        </Grid>
      ))}
    </Grid>
  )
}
