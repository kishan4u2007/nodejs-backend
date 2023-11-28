
import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path: "./env"
})


connectDB()






/* this is a old approach

import express from "express"
const app = express();

(async() => {
  try {
   await mongoose.connect(`${process.env.MONGODB_URI/{DB_Name}}`)

    app.on("error", (error) => {
        console.log("ERR", error)
        throw error
    })
    app.listen(process.env.PORT, () =>{
        console.log(`App is running on port no, ${process.env.PORT}`)
    })

  } catch (error) {
    console.log("Error", error)
    throw error
  }
})();

*/
