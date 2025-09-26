import { vi } from "vitest"

/**
 * Gerador incremental de IDs numéricos.
 */
export function createIdGenerator(start = 1) {
  let current = start
  return () => current++
}

const nextId = createIdGenerator(1)

/**
 * Cria um objeto de Perfil mínimo com valores padrão.
 */
export function makePerfil(overrides: Readonly<Record<string, unknown>> = {}) {
  return Object.freeze({ id: nextId(), nome: "Perfil", active: true, ...overrides })
}

/**
 * Cria um objeto de Permissão mínimo.
 */
export function makePermissao(overrides: Readonly<Record<string, unknown>> = {}) {
  return Object.freeze({ id: nextId(), permitido: true, ...overrides })
}

/**
 * Cria um objeto de Processo mínimo.
 */
export function makeProcesso(overrides: Readonly<Record<string, unknown>> = {}) {
  return Object.freeze({
    id: nextId(),
    numero: `P202401-${String(nextId()).padStart(4, "0")}`,
    active: true,
    requerente: "",
    ...overrides,
  })
}

/**
 * Cria um objeto de Usuário mínimo.
 */
export function makeUser(overrides: Readonly<Record<string, unknown>> = {}) {
  return Object.freeze({ id: `u-${nextId()}`, email: "user@example.com", ...overrides })
}

/**
 * Entidades auxiliares usadas em includes/foreign keys
 */
export function makeResponsavel(overrides: Readonly<Record<string, unknown>> = {}) {
  return Object.freeze({
    id: nextId(),
    nome: "Responsável",
    userId: `u-${nextId()}`,
    ...overrides,
  })
}

export function makeSituacao(overrides: Readonly<Record<string, unknown>> = {}) {
  return Object.freeze({ id: nextId(), nome: "Situação", ...overrides })
}

export function makeFormaEntrada(overrides: Readonly<Record<string, unknown>> = {}) {
  return Object.freeze({ id: nextId(), nome: "FormaEntrada", ...overrides })
}

/**
 * Utilitário para criar um objeto com métodos mockados (vi.fn) a partir de chaves.
 */
export function createModelMock(methods: readonly string[]) {
  const obj: Record<string, ReturnType<typeof vi.fn>> = {}
  for (const m of methods) obj[m] = vi.fn()
  return Object.freeze(obj)
}
