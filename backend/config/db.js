import mongoose from "mongoose";


const ConfigureDb = async function () {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("connected to DB");
    } catch (err) {
        console.error(`error connecting to db: ${err.message}`);
        throw err;
    }
}
export default ConfigureDb;