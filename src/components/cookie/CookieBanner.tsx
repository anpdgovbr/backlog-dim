"use client"

import { useState, useEffect } from "react"

import CloseIcon from "@mui/icons-material/Close"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Collapse from "@mui/material/Collapse"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import FormControlLabel from "@mui/material/FormControlLabel"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import { alpha } from "@mui/material/styles"
import type { CustomPreferencesModalProps, ConsentPreferences } from "react-lgpd-consent"

interface CookieInfo {
  name: string
  expiry: string
  domain: string
  company: string
  purpose: string
  description: string
}

interface CookieCategory {
  id: string
  name: string
  description: string
  required: boolean
  enabled: boolean
  cookies: CookieInfo[]
}

export default function CookiePreferencesModal({
  preferences,
  setPreferences,
  closePreferences,
  isModalOpen,
  texts,
}: CustomPreferencesModalProps) {
  const [categories, setCategories] = useState<CookieCategory[]>([])
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  // Inicializar categorias no client-side
  useEffect(() => {
    const hostname =
      typeof window !== "undefined" ? window.location.hostname : "localhost"

    const initialCategories = [
      {
        id: "necessary",
        name: "Cookies estritamente necessários",
        description:
          "Esses cookies permitem funcionalidades essenciais, tais como segurança, verificação de identidade e gestão de rede. Esses cookies não podem ser desativados em nossos sistemas. Embora sejam necessários, você pode bloquear esses cookies diretamente no seu navegador, mas isso pode comprometer sua experiência e prejudicar o funcionamento do site.",
        required: true,
        enabled: preferences?.necessary || true,
        cookies: [
          {
            name: "next-auth.session-token",
            expiry: "30 dias",
            domain: hostname,
            company: "NextAuth.js",
            purpose: "Autorização",
            description: "Cookie de autenticação da sessão do usuário",
          },
          {
            name: "next-auth.csrf-token",
            expiry: "Sessão",
            domain: hostname,
            company: "NextAuth.js",
            purpose: "Segurança",
            description: "Token CSRF para proteção contra ataques",
          },
        ],
      },
      {
        id: "analytics",
        name: "Cookies de desempenho",
        description:
          "Visam a melhoria do desempenho do site por meio da coleta de dados anonimizados sobre navegação e uso dos recursos disponibilizados. Se você não permitir a coleta desses cookies, esses dados não serão usados para melhoria do site.",
        required: false,
        enabled: preferences?.analytics || false,
        cookies: [
          {
            name: "_ga",
            expiry: "2 anos",
            domain: hostname,
            company: "Google Analytics",
            purpose: "Estatística",
            description:
              "Objetivo de registrar um número individual de ID cujo propósito é gerar dados estatísticos de visitas ao site.",
          },
          {
            name: "_gid",
            expiry: "24 horas",
            domain: hostname,
            company: "Google Analytics",
            purpose: "Estatística",
            description: "Usado para distinguir usuários por Google Analytics",
          },
        ],
      },
      {
        id: "marketing",
        name: "Cookies de terceiros",
        description:
          "O portal utiliza serviços oferecidos por terceiros que permitem melhorar as campanhas de informação, oferecer conteúdo interativo, melhorar a usabilidade e facilitar o compartilhamento de conteúdo nas redes sociais.",
        required: false,
        enabled: preferences?.marketing || false,
        cookies: [
          {
            name: "VISITOR_INFO1_LIVE",
            expiry: "180 dias",
            domain: "www.youtube.com",
            company: "Youtube",
            purpose: "Incorporar vídeo",
            description: "Cookie para incorporação de vídeos do YouTube",
          },
        ],
      },
    ]

    setCategories(initialCategories)
  }, [preferences])

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId && !cat.required ? { ...cat, enabled } : cat
      )
    )

    // Atualizar preferências na lib
    if (setPreferences) {
      const newPrefs = {
        ...(preferences || {}),
        [categoryId]: enabled,
        // garantir presence de `necessary` (obrigatório na tipagem)
        necessary: (preferences as any)?.necessary ?? true,
      } as ConsentPreferences
      setPreferences(newPrefs)
    }
  }

  const handleToggleExpanded = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleAcceptAll = () => {
    const allPreferences: Record<string, boolean> = {}
    categories.forEach((category) => {
      allPreferences[category.id] = true
    })
    setCategories((prev) => prev.map((cat) => ({ ...cat, enabled: true })))
    if (setPreferences) {
      const prefs = {
        ...allPreferences,
        // garantir `necessary` presente e true
        necessary: allPreferences.necessary ?? true,
      } as ConsentPreferences
      setPreferences(prefs)
    }
    closePreferences()
  }

  const handleRejectAll = () => {
    const minimalPreferences: Record<string, boolean> = {}
    categories.forEach((category) => {
      minimalPreferences[category.id] = category.required
    })
    setCategories((prev) => prev.map((cat) => ({ ...cat, enabled: cat.required })))
    if (setPreferences) {
      const prefs = {
        ...minimalPreferences,
        // garantir `necessary` presente (mínimo requerido)
        necessary: minimalPreferences.necessary ?? true,
      } as ConsentPreferences
      setPreferences(prefs)
    }
    closePreferences()
  }

  if (categories.length === 0) return null

  return (
    <>
      {/* Backdrop escuro com transparência - z-index maior que o SimpleBanner */}
      <Backdrop
        open={isModalOpen || false}
        sx={{
          backgroundColor: alpha("#000", 0.8),
          zIndex: (theme) => theme.zIndex.modal + 10,
        }}
      />

      {/* Modal Principal - z-index ainda maior */}
      <Dialog
        open={isModalOpen || false}
        onClose={closePreferences}
        maxWidth="lg"
        fullWidth
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 20,
          "& .MuiDialog-paper": {
            maxHeight: "90vh",
            m: 2,
            borderRadius: 2,
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
            pb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {texts.preferencesTitle || texts.modalTitle || "Configurações de Cookies"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="/termos-de-uso" target="_blank" rel="noopener">
                Ver Declaração de Cookies
              </Link>
            </Typography>
          </Box>
          <IconButton onClick={closePreferences} aria-label="Fechar" size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="body1" paragraph>
            {texts.preferencesDescription ||
              texts.modalIntro ||
              "Para melhorar a sua experiência na plataforma e prover serviços personalizados, utilizamos cookies."}{" "}
            <strong>
              Ao aceitar, você terá acesso a todas as funcionalidades do site. Se clicar
              em "Rejeitar Cookies", os cookies que não forem estritamente necessários
              serão desativados.
            </strong>{" "}
            Para escolher quais quer autorizar, clique em "Gerenciar cookies". Saiba mais
            em nossa{" "}
            <Link href="/termos-de-uso" target="_blank" rel="noopener">
              Declaração de Cookies
            </Link>
            .
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Classes de cookies
            </Typography>

            {categories.map((category) => (
              <Box key={category.id} sx={{ mb: 3 }}>
                {/* Header da Categoria */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Button
                    variant="text"
                    startIcon={
                      expandedCategories.includes(category.id) ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )
                    }
                    onClick={() => handleToggleExpanded(category.id)}
                    sx={{ textAlign: "left", justifyContent: "flex-start" }}
                  >
                    <Typography variant="h6" component="span">
                      {category.name}
                    </Typography>
                  </Button>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={category.enabled}
                        onChange={(e) =>
                          handleCategoryToggle(category.id, e.target.checked)
                        }
                        disabled={category.required}
                        size="small"
                      />
                    }
                    label={category.required ? "Obrigatório" : "Opcional"}
                    labelPlacement="start"
                  />
                </Box>

                {/* Descrição da Categoria */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{ ml: 2 }}
                >
                  {category.description}
                </Typography>

                {/* Lista de Cookies */}
                <Collapse in={expandedCategories.includes(category.id)}>
                  <Box sx={{ ml: 2, mt: 2 }}>
                    {category.cookies.map((cookie, index) => (
                      <Card
                        key={`${category.id}-${index}`}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Stack spacing={1}>
                            <Box
                              sx={{
                                display: "grid",
                                gridTemplateColumns: "120px 1fr",
                                gap: 1,
                                fontSize: "0.875rem",
                              }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                Cookie:
                              </Typography>
                              <Typography variant="body2">{cookie.name}</Typography>

                              <Typography variant="body2" fontWeight="bold">
                                Vencimento:
                              </Typography>
                              <Typography variant="body2">{cookie.expiry}</Typography>

                              <Typography variant="body2" fontWeight="bold">
                                Domínio:
                              </Typography>
                              <Typography variant="body2">{cookie.domain}</Typography>

                              <Typography variant="body2" fontWeight="bold">
                                Empresa:
                              </Typography>
                              <Typography variant="body2">{cookie.company}</Typography>

                              <Typography variant="body2" fontWeight="bold">
                                Finalidade:
                              </Typography>
                              <Typography variant="body2">{cookie.purpose}</Typography>

                              <Typography variant="body2" fontWeight="bold">
                                Descrição:
                              </Typography>
                              <Typography variant="body2">
                                {cookie.description}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Collapse>

                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}

            {/* Configuração no Navegador */}
            <Box sx={{ mt: 3, p: 2, bgcolor: "background.paper" }}>
              <Typography variant="h6" gutterBottom>
                Configuração de cookies no navegador
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Você pode desabilitá-los alterando as configurações do seu navegador.
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Link
                  href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=pt-BR"
                  target="_blank"
                >
                  Chrome
                </Link>
                <Link
                  href="https://support.mozilla.org/pt-BR/kb/desative-cookies-terceiros-impedir-rastreamento"
                  target="_blank"
                >
                  Firefox
                </Link>
                <Link
                  href="https://support.microsoft.com/pt-br/help/4027947/microsoft-edge-delete-cookies"
                  target="_blank"
                >
                  Microsoft Edge
                </Link>
                <Link
                  href="https://support.microsoft.com/pt-br/help/17442/windows-internet-explorer-delete-manage-cookies"
                  target="_blank"
                >
                  Internet Explorer
                </Link>
              </Stack>
            </Box>
          </Box>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button variant="outlined" size="small" onClick={closePreferences}>
            {texts.close || "Fechar"}
          </Button>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleRejectAll}
              color="error"
            >
              {texts.declineAll || "Rejeitar cookies"}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleAcceptAll}
              color="primary"
            >
              {texts.acceptAll || "Aceitar todos"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  )
}
