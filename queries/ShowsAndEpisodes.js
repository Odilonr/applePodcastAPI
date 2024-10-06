/*import mongoose from "mongoose"

const Schema = mongoose.Schema

const showSchema = new Schema({
  name: {
   type: String, 
   required: true
  },
  episodes : [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Episode'
    }
  ],
 
  hostName: String,
  hostImage: String,  
  description: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true
  },
  stars: Number,
  count: Number,
  showType: String,
  releaseSchedule: {
    type: String,
    required: true
  }, 
  studio: String,
  rated: String,
})

const Show = mongoose.model('Show', showSchema)

const episodeSchema = new Schema({
  title: {
    type: String, 
    required: true
  },
  show: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Show'
  },
  description: String,
  audioFile: String,
  dateAddedHours: Number,
  durationSeconds: Number
})  

const Episode = mongoose.model('Episode', episodeSchema)

export { Show, Episode } */

