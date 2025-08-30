import { MiddlewareHandler } from 'hono'
import { verify } from 'hono/jwt'

const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const payload = await verify(token, secret) as { sub: string, role: string }
    c.set('user', payload)
  } catch (error) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  await next()
}

export default authMiddleware
