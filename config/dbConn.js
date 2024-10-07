import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

async function poolQuery(text, params) {
  const res = await pool.query(text, params)
  return res
}

async function getClient() {
  const client = await pool.connect()
  return client
}


export {poolQuery,getClient}



