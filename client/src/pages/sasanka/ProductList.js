import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Button, Modal, InputNumber } from 'antd';

const { Meta } = Card;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visible, setVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/products');
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        setSelectedProduct(product);
        setVisible(true);
    };

    const handleOk = async () => {
        try {
            await axios.put(`http://localhost:5000/cart/1`, { itemId: selectedProduct.id, quantity });
            setVisible(false);
            // Optionally: Refresh the cart or show success message
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-4">
            <Row gutter={16}>
                {products.map((product) => (
                    <Col span={8} key={product.id}>
                        <Card
                            hoverable
                            cover={<img alt={product.name} src={`data:image/jpeg;base64,${product.img}`} />}
                            actions={[
                                <Button type="primary" onClick={() => handleAddToCart(product)}>
                                    Add to Cart
                                </Button>
                            ]}
                        >
                            <Meta title={product.name} description={`$${product.price}`} />
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal
                title="Add to Cart"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>Product: {selectedProduct?.name}</p>
                <p>Price: ${selectedProduct?.price}</p>
                <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(value) => setQuantity(value)}
                />
            </Modal>
        </div>
    );
};

export default ProductList;
