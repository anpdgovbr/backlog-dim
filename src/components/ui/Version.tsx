"use client"

export interface VersionProps
  extends Readonly<{
    prefix?: string
  }> {}

export default function Version({ prefix }: Readonly<VersionProps>) {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0"

  return <>{prefix ? `${prefix} ${version}` : version}</>
}
