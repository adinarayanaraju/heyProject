import { db } from '../../db'
import { Hono } from 'hono'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono()

app.post('/register', async (c) => {
  const { username, password } = await c.req.json()

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400)
  }

  const userExists = db.users.find((u) => u.username === username)
  if (userExists) {
    return c.json({ error: 'User already exists' }, 400)
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = {
    id: uuidv4(),
    username,
    password: hashedPassword,
    role: 'user', // default role
  }

  db.users.push(newUser)
  await db.write()

  return c.json({ message: 'User created successfully' }, 201)
})

export default app
