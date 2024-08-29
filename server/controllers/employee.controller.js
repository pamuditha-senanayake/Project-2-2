import express from 'express';
import service from '../services/employee.service.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const employees = await service.getAllEmployees();
        res.send(employees);
    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const employee = await service.getEmployeeById(req.params.id);
        if (employee === undefined) {
            res.status(404).json('No record with given id: ' + req.params.id);
        } else {
            res.send(employee);
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const affectedRows = await service.deleteEmployee(req.params.id);
        if (affectedRows === 0) {
            res.status(404).json('No record with given id: ' + req.params.id);
        } else {
            res.send('Deleted successfully.');
        }
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req, res, next) => {
    try {
        const newEmployee = await service.addEmployee(req.body);
        res.status(201).json(newEmployee);
    } catch (error) {
        next(error)
    }
});


router.put('/:id', async (req, res, next) => {
    try {
        const updatedEmployee = await service.updateEmployee(req.params.id, req.body);
        if (updatedEmployee) {
            res.send(updatedEmployee);
        } else {
            res.status(404).json('No record with given id: ' + req.params.id);
        }
    } catch (error) {
        next(error)
    }
});


export default router;
