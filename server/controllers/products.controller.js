import express from 'express';
import service from '../services/products.service.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const products = await service.getAllProducts();
        res.send(products);
    } catch (error) {
        next(error)
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const product = await service.getProductById(req.params.id);
        if (product === undefined) {
            res.status(404).json('No record with given id: ' + req.params.id);
        } else {
            res.send(product);
        }
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const affectedRows = await service.deleteProduct(req.params.id);
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
        const newProduct = await service.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error)
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const updatedProduct = await service.updateProduct(req.params.id, req.body);
        if (updatedProduct) {
            res.send(updatedProduct);
        } else {
            res.status(404).json('No record with given id: ' + req.params.id);
        }
    } catch (error) {
        next(error)
    }
});

export default router;
