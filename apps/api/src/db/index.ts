import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'

type Data = {
  users: any[]
  posts: any[]
}

class DB {
  private db: Low<Data>

  constructor() {
    const file = path.join(__dirname, 'src/db.json')
    const adapter = new JSONFile<Data>(file)
    this.db = new Low<Data>(adapter, { users: [], posts: [] })
    this.read()
  }

  async read() {
    await this.db.read()
  }

  async write() {
    await this.db.write()
  }

  get posts() {
    return this.db.data?.posts || []
  }

  set posts(posts: any[]) {
    if (this.db.data) {
      this.db.data.posts = posts
    }
  }

  get users() {
    return this.db.data?.users || []
  }

  set users(users: any[]) {
    if (this.db.data) {
      this.db.data.users = users
    }
  }
}

export const db = new DB()
