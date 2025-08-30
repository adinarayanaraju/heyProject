import { Hono } from 'hono'
import loginRouter from './login'
import registerRouter from './register'

const app = new Hono()

app.route('/', loginRouter)
app.route('/', registerRouter)

export default app
