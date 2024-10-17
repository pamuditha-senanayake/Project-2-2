import db from "../db.js";


/*const getAllProfessional = async () => {
    const records = await db.query("SELECT * FROM professionals ");
    return records.rows;
};*/

const getAllSProfessional = async (serviceIds) => {
    let query = `
        SELECT DISTINCT p.*
        FROM professionals p
                 JOIN professional_services ps ON p.id = ps.professional_id
    `;

    if (serviceIds.length > 0) {
        // Add filtering by selected service IDs
        query += ` WHERE ps.service_id = ANY($1::int[])`;
    }

    const records = await db.query(query, serviceIds.length > 0 ? [serviceIds] : []);
    return records.rows;
};


export default {
    getAllSProfessional
};