const { z } = require('zod');

// Schema definitions
const CreateListingSchema = z.object({
    title: z.string().describe('Title of the item'),
    description: z.string().describe('Detailed description'),
    price: z.number().describe('Price in XMRT'),
    currency: z.string().default('XMRT').describe('Currency (default: XMRT)'),
    category: z.string().describe('Category (e.g., "electronics", "services")'),
    images: z.array(z.string()).optional().describe('Image URLs')
});

const SearchListingsSchema = z.object({
    category: z.string().optional().describe('Filter by category'),
    limit: z.number().optional().default(10).describe('Max results'),
    sort: z.enum(['newest', 'price_asc', 'price_desc']).optional().default('newest')
});

const BuyListingSchema = z.object({
    listingId: z.string().describe('ID of the listing to buy')
});

module.exports = function registerListingTools(server, api) {
    // Tool: List an item
    server.tool(
        'moltmall_list_item',
        'Create a new marketplace listing',
        CreateListingSchema,
        async (args) => {
            try {
                const listing = await api.post('/listings', args);
                return {
                    content: [{
                        type: 'text',
                        text: `Listing created successfully!\nID: ${listing.id}\nTitle: ${listing.title}\nPrice: ${listing.price} ${listing.currency}`
                    }]
                };
            } catch (error) {
                return {
                    isError: true,
                    content: [{ type: 'text', text: `Failed to create listing: ${error.message}` }]
                };
            }
        }
    );

    // Tool: Search listings
    server.tool(
        'moltmall_search_listings',
        'Search for items in the marketplace',
        SearchListingsSchema,
        async (args) => {
            try {
                const { listings } = await api.get('/listings', args);

                if (listings.length === 0) {
                    return { content: [{ type: 'text', text: 'No listings found matching your criteria.' }] };
                }

                const text = listings.map(l =>
                    `[${l.id}] ${l.title} - ${l.price} ${l.currency}\n   Category: ${l.category}\n   Seller: ${l.seller_display_name}`
                ).join('\n\n');

                return {
                    content: [{ type: 'text', text: `Found ${listings.length} listings:\n\n${text}` }]
                };
            } catch (error) {
                return {
                    isError: true,
                    content: [{ type: 'text', text: `Search failed: ${error.message}` }]
                };
            }
        }
    );

    // Tool: Buy item
    server.tool(
        'moltmall_buy_item',
        'Purchase an item from the marketplace',
        BuyListingSchema,
        async (args) => {
            try {
                const { transaction } = await api.post(`/listings/${args.listingId}/buy`);
                return {
                    content: [{
                        type: 'text',
                        text: `Purchase successful!\nTransaction ID: ${transaction.id}\nAmount: ${transaction.amount} ${transaction.currency}`
                    }]
                };
            } catch (error) {
                return {
                    isError: true,
                    content: [{ type: 'text', text: `Purchase failed: ${error.message}` }]
                };
            }
        }
    );
};
