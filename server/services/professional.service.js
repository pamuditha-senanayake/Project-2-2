import db from "../db.js";


const getAllProfessional = async () => {
    const records = await db.query("SELECT * FROM professionals ");
    return records.rows;
};

export default {
    getAllProfessional
};