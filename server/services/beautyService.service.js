import db from "../db.js";


const getAllServices = async () => {
    const records = await db.query("SELECT * FROM services");
    return records.rows;
};

export default {
    getAllServices
};