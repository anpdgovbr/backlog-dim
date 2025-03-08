import { Folder, Group, List } from "@mui/icons-material"
import {
  Container,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material"
import Link from "next/link"

const links = [
  { href: "/admin/contato-previo", text: "Contato Prévio", icon: <Group /> },
  { href: "/admin/encaminhamento", text: "Encaminhamentos", icon: <List /> },
  { href: "/admin/evidencia", text: "Evidências", icon: <Folder /> },
]

export default function AdminDashboard() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Painel Administrativo
      </Typography>
      <List>
        {links.map(({ href, text, icon }) => (
          <ListItemButton key={href} component={Link} href={href}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </Container>
  )
}
