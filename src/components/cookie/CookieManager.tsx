"use client"

import { ConsentProvider, setDebugLogging, LogLevel } from "react-lgpd-consent"
import SimpleCookieBanner from "./SimpleCookieBanner"
import CookiePreferencesModal from "./CookieBanner"
import CookieManagementDock from "./CookieManagementDock"

// Habilitar debug em desenvolvimento
if (process.env.NODE_ENV === "development") {
  setDebugLogging(true, LogLevel.DEBUG)
}

interface CookieManagerProps {
  children: React.ReactNode
}

export default function CookieManager({ children }: CookieManagerProps) {
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
      <CookieManagementDock />
    </ConsentProvider>
  )
}
