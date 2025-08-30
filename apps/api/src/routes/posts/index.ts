import { Hono } from 'hono'
import { db } from '../../db'
import authMiddleware from '../../middlewares/authMiddleware'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono()


app.get('/', (c) => {
  return c.json(db.posts)
})

app.get('/:id', (c) => {
  const post = db.posts.find((p) => p.id === c.req.param('id'))
  if (!post) {
    return c.json({ error: 'Post not found' }, 404)
  }
  return c.json(post)
})

app.post('/', async (c) => {
  const user = c.get('user')
  const { content } = await c.req.json()
  const newPost = {
    id: uuidv4(),
    authorId: user.sub,
    content,
    createdAt: new Date().toISOString(),
  }
  db.posts.push(newPost)
  await db.write()
  return c.json(newPost, 201)
})

app.put('/:id', async (c) => {
  const post = db.posts.find((p) => p.id === c.req.param('id'))
  if (!post) {
    return c.json({ error: 'Post not found' }, 404)
  }
  const user = c.get('user')
  if (post.authorId !== user.sub && user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403)
  }
  const { content } = await c.req.json()
  post.content = content
  await db.write()
  return c.json(post)
})

app.delete('/:id', async (c) => {
  const user = c.get('user')
  if (user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403)
  }
  const postIndex = db.posts.findIndex((p) => p.id === c.req.param('id'))
  if (postIndex === -1) {
    return c.json({ error: 'Post not found' }, 404)
  }
  const [deletedPost] = db.posts.splice(postIndex, 1)
  await db.write()
  return c.json(deletedPost)
})

export default app
