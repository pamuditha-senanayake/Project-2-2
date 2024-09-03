import React, {useState} from 'react';
//import axios from 'axios';

const AddProductForm = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Health & Medicine'); // Default to Health & Medicine
    const [quantity, setQuantity] = useState('');
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('');
    const [compareAtPrice, setCompareAtPrice] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('quantity', quantity);
        formData.append('sku', sku);
        formData.append('price', price);
        formData.append('compareAtPrice', compareAtPrice);
        formData.append('image', image);

        try {
            /* await axios.post('/api/products', formData, {
                 headers: {
                     'Content-Type': 'multipart/form-data'
                 }
             });*/
            alert('Product added successfully!');
        } catch (error) {
            console.error('There was an error adding the product!', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Description</h2>
                <label style={styles.label}>Product Name</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    style={styles.input}
                />
                <label style={styles.label}>Item Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={styles.textarea}
                />
                <label style={styles.label}>Product Category</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={styles.select}
                >
                    <option value="Health & Medicine">Health & Medicine</option>
                    <option value="Beauty">Beauty</option>
                    {/* Add more categories as needed */}
                </select>
                <label style={styles.label}>Quantity</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    style={styles.input}
                />
                <label style={styles.label}>SKU (optional)</label>
                <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    style={styles.input}
                />
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Inventory</h2>
                <input
                    type="file"
                    onChange={handleImageChange}
                    required
                    style={styles.fileInput}
                />
                <h2 style={styles.sectionTitle}>Pricing</h2>
                <label style={styles.label}>Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={styles.input}
                />
                <label style={styles.label}>Compare at Price</label>
                <input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    style={styles.input}
                />
            </div>

            <div style={styles.buttonGroup}>
                <button type="button" style={styles.cancelButton}>Cancel</button>
                <button type="submit" style={styles.addButton}>Add Product</button>
            </div>
        </form>
    );
};

const styles = {
    form: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        gap: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    section: {
        flex: 1,
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        marginBottom: '15px',
        color: '#333',
    },
    label: {
        fontSize: '1.1rem',
        color: '#333',
        marginBottom: '5px',
        display: 'block',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        boxSizing: 'border-box',
        marginBottom: '15px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        boxSizing: 'border-box',
        height: '100px',
        resize: 'none',
        marginBottom: '15px',
    },
    select: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        boxSizing: 'border-box',
        marginBottom: '15px',
    },
    fileInput: {
        marginTop: '10px',
        marginBottom: '15px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        position: 'absolute',
        bottom: '20px',
        right: '20px',
    },
    cancelButton: {
        padding: '5px 10px',
        fontSize: '0.875rem',
        color: '#333',
        backgroundColor: '#f5f5f5',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    addButton: {
        padding: '5px 10px',
        fontSize: '0.875rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default AddProductForm;
