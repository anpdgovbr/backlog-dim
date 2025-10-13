"use client"

import { ConsentProvider, LogLevel, setDebugLogging } from "react-lgpd-consent"
import CookiePreferencesModal from "./CookieBanner"
import SimpleCookieBanner from "./SimpleCookieBanner"

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
        enabledCategories: ["analytics"],
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
        contactInfo: "Contato: encarregado@anpd.gov.br",
      }}
      disableDeveloperGuidance={true}
      disableFloatingPreferencesButton={true}
      CookieBannerComponent={SimpleCookieBanner}
      PreferencesModalComponent={CookiePreferencesModal}
      disableDiscoveryLog={true}
    >
      {children}

      {/* TODO: Ativar junto do MenuDev futuramente 
      <CookieManagementDock />*/}
    </ConsentProvider>
  )
}
