import express from 'express';
import fs from 'fs'; // Import fs module
import service from '../services/products.service.js';
import multer from 'multer';

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save to 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Save the file with a unique name
    }
});

const upload = multer({ storage: storage });

// Fetch all products
router.get('/', async (req, res, next) => {
    try {
        const products = await service.getAllProducts();
        res.send(products);
    } catch (error) {
        next(error);
    }
});

// Fetch product by ID
router.get('/:id', async (req, res, next) => {
    try {
        const product = await service.getProductById(req.params.id);
        if (!product) {
            res.status(404).json('No record with given id: ' + req.params.id);
        } else {
            res.send(product);
        }
    } catch (error) {
        next(error);
    }
});

// Delete product by ID
router.delete('/:id', async (req, res, next) => {
    try {
        const affectedRows = await service.deleteProduct(req.params.id);
        if (affectedRows === 0) {
            res.status(404).json('No record with given id: ' + req.params.id);
        } else {
            res.send('Deleted successfully.');
        }
    } catch (error) {
        next(error);
    }
});

// Add new product with image upload
router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        const { title, price, category, description, quantity } = req.body;
        const image = req.file ? req.file.filename : null; // If image exists, save its filename

        const newProduct = await service.addProduct({
            title,
            price,
            category,
            description,
            quantity,
            image
        });

        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
});

// Update product with image upload
router.put('/:id', upload.single('image'), async (req, res, next) => {
    try {
        const { title, price, category, description, quantity } = req.body;

        // Fetch the existing product to retain the current image if no new one is uploaded
        const currentProduct = await service.getProductById(req.params.id);

        // Use the new file if uploaded, otherwise use the existing image
        const image = req.file ? req.file.filename : currentProduct.image;

        const updatedProduct = await service.updateProduct(req.params.id, {
            title,
            price,
            category,
            description,
            quantity,
            image
        });

        if (updatedProduct) {
            res.send(updatedProduct); // Ensure the updated product details are sent back
        } else {
            res.status(404).json('No record with given id: ' + req.params.id);
        }
    } catch (error) {
        next(error);
    }
});



// routes/products.js (or your routes file)
router.get('/stats', async (req, res, next) => {
    try {
        const stats = await service.getProductStats(); // Directly call the stats service
        res.json(stats); // Send the stats back as JSON
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});








export default router;