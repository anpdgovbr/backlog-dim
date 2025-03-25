"use client"

import TopNotification from "@/components/notification/TopNotification"
import React, { createContext, useContext, useState } from "react"

type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationOptions {
  message: string
  type?: NotificationType
}

interface NotificationContextValue {
  notify: (options: NotificationOptions) => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

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

  const notify = ({ message, type = "info" }: NotificationOptions) => {
    setMessage(message)
    setType(type)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <TopNotification open={open} message={message} type={type} onClose={handleClose} />
    </NotificationContext.Provider>
  )
}
