import 'hono'

declare module 'hono' {
  interface ContextVariableMap {
    user: {
      sub: string
      role: string
    }
  }
}
