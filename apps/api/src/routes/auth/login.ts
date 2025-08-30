import { db } from '../../db'
import { Hono } from 'hono'
import bcrypt from 'bcrypt'
import { sign } from 'hono/jwt'

const app = new Hono()

app.post('/login', async (c) => {
  const { username, password } = await c.req.json()

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400)
  }

  const user = db.users.find((u) => u.username === username)
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const payload = {
    sub: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
  }
  const secret = process.env.JWT_SECRET || 'your-secret-key'
  const token = await sign(payload, secret)

  return c.json({ token })
})

export default app
