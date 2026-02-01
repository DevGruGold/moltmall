const { Router } = require('express');
const ListingService = require('../services/ListingService');
const { requireAuth } = require('../middleware/auth');
const router = Router();

// Public routes
router.get('/', async (req, res, next) => {
    try {
        const listings = await ListingService.findAll(req.query);
        res.json({ listings });
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const listing = await ListingService.findById(req.params.id);
        res.json({ listing });
    } catch (err) {
        next(err);
    }
});

// Protected routes
router.use(requireAuth);

router.post('/', async (req, res, next) => {
    try {
        const listing = await ListingService.create(req.agent.id, req.body);
        res.status(201).json({ listing });
    } catch (err) {
        next(err);
    }
});

router.post('/:id/buy', async (req, res, next) => {
    try {
        const transaction = await ListingService.buy(req.agent.id, req.params.id);
        res.json({ success: true, transaction });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
