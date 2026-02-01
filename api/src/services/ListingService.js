const { queryOne, queryAll, transaction } = require('../config/database');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

class ListingService {
    static async create(agentId, data) {
        const { title, description, price, currency = 'XMRT', category, images = [] } = data;

        if (!title || !price) {
            throw new BadRequestError('Title and price are required');
        }

        return queryOne(
            `INSERT INTO listings (agent_id, title, description, price, currency, category, images, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       RETURNING *`,
            [agentId, title, description, price, currency, category, images]
        );
    }

    static async findAll({ category, limit = 20, offset = 0, sort = 'newest' }) {
        let orderBy = 'l.created_at DESC';
        if (sort === 'price_asc') orderBy = 'l.price ASC';
        if (sort === 'price_desc') orderBy = 'l.price DESC';

        let whereClause = "l.status = 'active'";
        const params = [limit, offset];

        if (category) {
            params.push(category);
            whereClause += ` AND l.category = $${params.length}`;
        }

        return queryAll(
            `SELECT l.*, a.name as seller_name, a.display_name as seller_display_name 
       FROM listings l
       JOIN agents a ON l.agent_id = a.id
       WHERE ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $1 OFFSET $2`,
            params
        );
    }

    static async findById(id) {
        const listing = await queryOne(
            `SELECT l.*, a.name as seller_name, a.display_name as seller_display_name 
       FROM listings l
       JOIN agents a ON l.agent_id = a.id
       WHERE l.id = $1`,
            [id]
        );

        if (!listing) throw new NotFoundError('Listing not found');
        return listing;
    }

    static async buy(buyerId, listingId) {
        return transaction(async (client) => {
            // Lock listing row
            const listing = await client.query(
                `SELECT * FROM listings WHERE id = $1 FOR UPDATE`,
                [listingId]
            ).then(res => res.rows[0]);

            if (!listing) throw new NotFoundError('Listing not found');
            if (listing.status !== 'active') throw new BadRequestError('Listing is not available');
            if (listing.agent_id === buyerId) throw new BadRequestError('Cannot buy your own listing');

            // Create transaction record
            const trx = await client.query(
                `INSERT INTO transactions (listing_id, buyer_id, seller_id, amount, currency, status)
         VALUES ($1, $2, $3, $4, $5, 'completed')
         RETURNING *`,
                [listingId, buyerId, listing.agent_id, listing.price, listing.currency]
            ).then(res => res.rows[0]);

            // Update listing status
            await client.query(
                `UPDATE listings SET status = 'sold', updated_at = NOW() WHERE id = $1`,
                [listingId]
            );

            return trx;
        });
    }
}

module.exports = ListingService;
