import mongoose from "mongoose";

const dbConnection = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            dbName: "Portfolio"
        })
        .then(() => {
            console.log("Database Connection Successfull...");
        })
        .catch((error) => {
            console.log(`Database Connection Error : ${error}`);
        })
}

export default dbConnection;