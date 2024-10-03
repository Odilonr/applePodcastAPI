import mongoose from "mongoose";

async function connectDB () {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.DATABASE_URI)
  } catch (err) {
    console.log(err)
  }
}

export { connectDB }