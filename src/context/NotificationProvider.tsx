"use client"

import React, { createContext, useCallback, useContext, useState } from "react"

import TopNotification from "@/components/notification/TopNotification"

/**
 * Tipos e contexto para o sistema de notificações.
 *
 * O `NotificationProvider` expõe `useNotification()` que permite disparar
 * notificações do topo (`TopNotification`). Esses tipos são exportados para
 * documentar o contrato usado pela aplicação.
 */
export type NotificationType = "success" | "error" | "info" | "warning"

export type NotificationOptions = {
  /** Mensagem a ser exibida na notificação */
  message: string
  /** Tipo/estilo da notificação (opcional) */
  type?: NotificationType
}

export interface NotificationContextValue {
  /**
   * Dispara uma notificação.
   * @example
   * notify({ message: 'Operação realizada', type: 'success' })
   */
  notify: (options: NotificationOptions) => void
}

export const NotificationContext = createContext<NotificationContextValue | null>(null)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider")
  return context
}

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [type, setType] = useState<NotificationType>("info")

  const notify = useCallback(({ message, type = "info" }: NotificationOptions) => {
    setMessage(message)
    setType(type)
    setOpen(true)
  }, [])

  const handleClose = () => setOpen(false)

  const value = React.useMemo(() => ({ notify }), [notify])

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <TopNotification open={open} message={message} type={type} onClose={handleClose} />
    </NotificationContext.Provider>
  )
}
