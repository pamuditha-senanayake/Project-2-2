router.post('/add', async (req, res) => {
    const {cardType, cardHolderName, cardNo, expiryDate, cvcNo} = req.body;

    if (!cardType || !cardHolderName || !cardNo || !expiryDate || !cvcNo) {
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        const query = `
            INSERT INTO Cards (cardType, cardHolderName, cardNo, expiryDate, cvcNo)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [cardType, cardHolderName, cardNo, expiryDate, cvcNo];

        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Get all cards
router.get('/get', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Cards');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get a specific card by ID
router.get('/get/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Cards WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({message: 'Card not found'});
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Update a card
router.put('/update/:id', async (req, res) => {
    const {cardType, cardHolderName, cardNo, expiryDate, cvcNo} = req.body;

    if (!cardType || !cardHolderName || !cardNo || !expiryDate || !cvcNo) {
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        const query = `
            UPDATE Cards
            SET cardType       = $1,
                cardHolderName = $2,
                cardNo         = $3,
                expiryDate     = $4,
                cvcNo          = $5,
                updated_at     = NOW()
            WHERE id = $6 RETURNING *;
        `;
        const values = [cardType, cardHolderName, cardNo, expiryDate, cvcNo, req.params.id];

        const result = await db.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({message: 'Card not found'});
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Delete a card
router.delete('/delete/:id', async (req, res) => {
    try {
        const result = await db.query('DELETE FROM Cards WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({message: 'Card not found'});
        res.json({message: 'Card deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Increment usage count for a card
router.post('/increment/:cardId', async (req, res) => {
    const cardId = req.params.cardId;

    try {
        const result = await db.query(`
            INSERT INTO CardUsage (cardId, usageCount)
            VALUES ($1, 1) ON CONFLICT (cardId)
      DO
            UPDATE SET usageCount = CardUsage.usageCount + 1
                RETURNING *;
        `, [cardId]);

        res.status(200).json({message: 'Usage count incremented successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error incrementing usage count', error: error.message});
    }
});

// Get usage report
router.get('/report', async (req, res) => {
    try {
        const usageReport = await db.query(`
            SELECT Cards.cardType, Cards.cardHolderName, CardUsage.usageCount
            FROM CardUsage
                     JOIN Cards ON CardUsage.cardId = Cards.id;
        `);

        res.status(200).json(usageReport.rows);
    } catch (error) {
        res.status(500).json({message: 'Error generating usage report', error: error.message});
    }
});