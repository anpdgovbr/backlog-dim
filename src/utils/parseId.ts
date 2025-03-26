export const parseId = (val: unknown): number | null => {
  if (val === "" || val === undefined || val === null) return null

  const num = Number(val)
  return isNaN(num) ? null : num
}
