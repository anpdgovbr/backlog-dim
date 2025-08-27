"use client"

import { ConsentProvider, LogLevel, setDebugLogging } from "react-lgpd-consent"
import CookiePreferencesModal from "./CookieBanner"
import SimpleCookieBanner from "./SimpleCookieBanner"

// Habilitar debug em desenvolvimento
if (process.env.NODE_ENV === "development") {
  setDebugLogging(true, LogLevel.DEBUG)
}

export interface CookieManagerProps {
  readonly children: React.ReactNode
}

export default function CookieManager({ children }: Readonly<CookieManagerProps>) {
  return (
    <ConsentProvider
      categories={{
        enabledCategories: ["analytics", "marketing"],
      }}
      texts={{
        bannerMessage:
          "Para melhorar a sua experiência na plataforma e prover serviços personalizados, utilizamos cookies.",
        acceptAll: "Aceitar cookies",
        declineAll: "Rejeitar cookies",
        preferences: "Gerenciar cookies",
        preferencesTitle: "Configurações de Cookies",
        preferencesDescription:
          "Para melhorar a sua experiência na plataforma e prover serviços personalizados, utilizamos cookies.",
        close: "Fechar",
        controllerInfo: "ANPD - Agência Nacional de Proteção de Dados",
        contactInfo: "Contato: dpo@anpd.gov.br",
      }}
      onConsentGiven={(state) => {
        // eslint-disable-next-line no-console
        console.info("🎉 Consentimento dado:", state)
      }}
      onPreferencesSaved={(prefs) => {
        // eslint-disable-next-line no-console
        console.info("💾 Preferências salvas:", prefs)
      }}
      // Desabilitar botão flutuante padrão para usar o nosso customizado
      disableFloatingPreferencesButton={true}
      // Componentes customizados
      CookieBannerComponent={SimpleCookieBanner}
      PreferencesModalComponent={CookiePreferencesModal}
    >
      {children}

      {/* Dock de gerenciamento customizado */}
      {/* TODO: Ativar junto do MenuDev futuramente 
      <CookieManagementDock />*/}
    </ConsentProvider>
  )
}
