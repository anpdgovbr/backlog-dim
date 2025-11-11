"use client"

import {
  GovBRCookieBanner,
  GovBRCookiePreferencesModal,
  type CookieCategoryMetadata,
} from "@anpdgovbr/shared-ui"
import {
  ConsentProvider,
  LogLevel,
  type CustomCookieBannerProps,
  type CustomPreferencesModalProps,
  type ConsentTexts,
  setDebugLogging,
} from "react-lgpd-consent"

if (process.env.NODE_ENV === "development") {
  setDebugLogging(true, LogLevel.DEBUG)
}

export interface CookieManagerProps {
  readonly children: React.ReactNode
}

const consentTexts: ConsentTexts = {
  bannerMessage:
    "Para melhorar a sua experiência na plataforma e prover serviços personalizados, utilizamos cookies.",
  acceptAll: "Aceitar todos os cookies",
  declineAll: "Rejeitar cookies",
  preferences: "Gerenciar cookies",
  modalTitle: "Preferências de cookies",
  modalIntro:
    "Personalize quais categorias deseja permitir. Cookies estritamente necessários permanecem ativos para garantir o funcionamento do site.",
  save: "Salvar preferências",
  necessaryAlwaysOn:
    "Esta categoria é obrigatória para o funcionamento do sistema e permanece ativa.",
  close: "Cancelar",
  accept: "Ativo",
  reject: "Inativo",
  controllerInfo: "Controlador: ANPD — Agência Nacional de Proteção de Dados",
  contactInfo: "Contato do encarregado: encarregado@anpd.gov.br",
}

const categoriesMetadata: CookieCategoryMetadata[] = [
  {
    id: "necessary",
    label: "Cookies estritamente necessários",
    description:
      "Permitem funcionalidades essenciais de segurança, autenticação institucional e gestão de sessão. Você pode bloqueá-los no navegador, mas isso pode comprometer o funcionamento.",
    required: true,
  },
  {
    id: "analytics",
    label: "Cookies de desempenho",
    description:
      "Coletam estatísticas anonimizadas de uso para aprimorar serviços e identificar problemas técnicos.",
  },
  {
    id: "marketing",
    label: "Cookies de terceiros",
    description:
      "Habilitam integrações externas, conteúdo incorporado e campanhas institucionais em canais oficiais.",
  },
]

function BannerComponent({
  consented,
  acceptAll,
  rejectAll,
  openPreferences,
  texts,
  blocking,
}: CustomCookieBannerProps) {
  return (
    <GovBRCookieBanner
      open={!consented}
      onAcceptAll={acceptAll}
      onRejectAll={rejectAll}
      onOpenPreferences={openPreferences}
      texts={texts}
      showBackdrop={blocking ?? true}
      disablePolicyLink={!texts.policyLink}
    />
  )
}

function PreferencesModalComponent(props: CustomPreferencesModalProps) {
  return (
    <GovBRCookiePreferencesModal
      {...props}
      categoriesMetadata={categoriesMetadata}
      textsOverride={{
        modalTitle: consentTexts.modalTitle,
        modalIntro: consentTexts.modalIntro,
        save: consentTexts.save,
        necessaryAlwaysOn: consentTexts.necessaryAlwaysOn,
        close: consentTexts.close,
        accept: consentTexts.accept,
        reject: consentTexts.reject,
      }}
    />
  )
}

export default function CookieManager({ children }: Readonly<CookieManagerProps>) {
  return (
    <ConsentProvider
      texts={consentTexts}
      categories={{
        enabledCategories: ["analytics", "marketing"],
      }}
      disableDeveloperGuidance={true}
      disableFloatingPreferencesButton={true}
      CookieBannerComponent={BannerComponent}
      PreferencesModalComponent={PreferencesModalComponent}
      disableDiscoveryLog={true}
    >
      {children}

      {/* TODO: Ativar junto do MenuDev futuramente 
      <CookieManagementDock />*/}
    </ConsentProvider>
  )
}
