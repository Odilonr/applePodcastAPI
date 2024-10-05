import { query } from "express";
import { Episode } from "../model/ShowsAndEpisodes.js";
import createError from "http-errors"

async function getAllEpisodes (req, res) {
  
  const {cursor, limit = 10} = req.body
  query = {}

  if (cursor) {
    query._id = { $gt: cursor}
  }
  const episodes = await Episode.find(query).limit(limit)

  prev_cu
}

