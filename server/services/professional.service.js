import db from "../db.js";


const getAllprofessional = async () => {
    const records = await db.query("SELECT * FROM professionals ");
    return records.rows;
};

export default {
    getAllprofessional
};