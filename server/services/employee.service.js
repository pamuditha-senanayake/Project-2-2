import db from '../db.js';

const getAllEmployees = async () => {
    const records = await db.query("SELECT * FROM employees");
    return records.rows;
};

const getEmployeeById = async (id) => {
    const record = await db.query("SELECT * FROM employees WHERE id = $1", [id]);
    return record.rows[0];
};

const deleteEmployee = async (id) => {
    const affectedRows = await db.query("DELETE FROM employees WHERE id = $1", [id]);
    return affectedRows.rows[0];
};

const addEmployee = async (employeeData) => {
    const {name, employee_code, salary} = employeeData;
    const result = await db.query(
        "INSERT INTO employees (name, employee_code, salary) VALUES ($1, $2, $3) RETURNING *",
        [name, employee_code, salary]
    );
    return result.rows[0];
};
const updateEmployee = async (id, employeeData) => {
    const {name, employee_code, salary} = employeeData;
    const result = await db.query(
        "UPDATE employees SET name = $1, employee_code = $2, salary = $3 WHERE id = $4 RETURNING *",
        [name, employee_code, salary, id]
    );
    return result.rows[0];
};


export default {
    getAllEmployees,
    getEmployeeById,
    deleteEmployee,
    addEmployee,
    updateEmployee
};
