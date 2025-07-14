import mongoose from "mongoose";
import serverConfig from "./serverConfig.js";

async function connectToDb() {
    try {
        await mongoose.connect(serverConfig.DB_URL)
        console.log("Db Connected")
    } catch (error) {
        console.log("Error While connecting to db",error)
    }
}

export default connectToDb;