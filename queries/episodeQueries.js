import { poolQuery, getClient} from '../config/dbConn.js'
import { v4 as uuidv4 } from 'uuid'

async function getAllEpisodes () {
  const text = `SELECT * FROM episodes`
  const result = await poolQuery(text)
  return result.rows.length > 0 ? result.rows : null
}

async function getEpByTitleShowId (episodeTitle, showID) {
  const queryText = `SELECT * FROM episodes WHERE title = $1 AND show_id = $2`
  const result = await poolQuery(queryText, [episodeTitle, showID])
  return result.rows[0]
}

async function getEpisodeById(episodeID) {
  const queryText = `SELECT * FROM episodes WHERE id = $1`
  const result = await poolQuery(queryText, [episodeID])
  return result.rows[0]
}

async function addEpisode (newEpisode) {
  const client = await getClient()

  try {
    await client.query('BEGIN')
    const queryText = `INSERT INTO episodes(id, title, description, audio_link, date_added, date_updated,  
    duration, show_id)
     VALUES($1, $2, $3, $4, $5, $6, $7, $8)`
    const values = [uuidv4(), newEpisode.title, newEpisode.description, newEpisode.audio_link, 
      newEpisode.date_added, newEpisode.date_added, newEpisode.duration, newEpisode.show_id
    ]
    const result = await client.query(queryText, values)
    await client.query('COMMIT')
    return result
  } catch(e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

async function updateEpisode (episodeID, updates) {
  const client = await getClient()
  const updateKeys = Object.keys(updates)
  try {
    await client.query('BEGIN')
    for (let key of updateKeys) {
      if (key !== 'id') {
        const queryText = `UPDATE episodes SET ${key} = $1 WHERE id = $2`
        const values = [updates[key], episodeID]
        const result = await client.query(queryText, values) 
      }
    }
    await client.query('COMMIT')
    const changedEp = await getEpisodeById(episodeID)
    return changedEp
  } catch(e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

async function deleteEpisode(episodeID) {
  const client = await getClient()
  try {
    await client.query('BEGIN')
    const queryText = `DELETE FROM episodes WHERE id = $1`
    const result = await client.query(queryText, [episodeID])
    await client.query('COMMIT')
    return result.rows
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}


export {getAllEpisodes, getEpisodeById, getEpByTitleShowId , addEpisode, updateEpisode, deleteEpisode}