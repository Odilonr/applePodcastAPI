import { poolQquery, getClient} from "../config/dbConn.js";
import {v4 as uuidv4} from 'uuid'
import { format } from 'date-fns';

async function getAllShows () {
  const text = `SELECT * FROM shows`
  const result = await poolQquery(text)
  return result.rows > 0 ? result.rows : null
}

async function getShowByName (showName) {
  const queryText = `SELECT * FROM shows WHERE name = $1`
  const result = await poolQquery(queryText, [showName])
  return result.rows[0]
}

async function getShowById(showID) {
  const queryText = `SELECT * FROM shows WHERE id = $1`
  const result = await poolQquery(queryText, [showID])
  return result.rows[0]
}

async function addShow (newShow) {
  const client = await getClient()
  const date_added = format(new Date(), 'yyyy-MM-dd HH:mm:ss')

  try {
    await client.query('BEGIN')
    const queryText = `INSERT INTO shows(id, name, description, profile_img_link, release_schedule ,studio, 
    host_name, host_img_link, review_stars, review_count, rated, date_added, show_type) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`
    const values = [uuidv4(), newShow.name, newShow.description, newShow.profileImage, 
      newShow.releaseSchedule, newShow.studio, newShow.hostName, newShow.hostImage, newShow.review_stars, 
      newShow.review_count, newShow.rated, date_added, newShow.showType
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

async function updateShow (showID, updates) {
  const client = await getClient()
  const updateKeys = Object.keys*updates
  try {
    await client('BEGIN')
    for (let key of updateKeys) {
      const queryText = `UPDATE shows SET ${key} = $1 WHERE id = $2`
      const values = [updates[key], showID]
      await client.query(queryText, values)
    }
    await client('COMMIT')
  } catch(e) {
    await client('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

async function deleteShow (showID) {
  const client = await getClient()
  try {
    await client.query('BEGIN')
    //const queryTextEpisodes = `DELETE FROM episodes USING shows WHERE show_id = $1`
    const queryText = `DELETE FROM shows WHERE id = $1`
    const result = client.query(queryText, [showID])
    await client.query('COMMIT')
    return result
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {

  }
}


export {getAllShows, addShow, getShowByName, updateShow, getShowById, deleteShow}

