const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');
const parser = new Parser();

const FEED_URL = 'https://paragraph.xyz/@xmrt/rss';
console.log('RSS Feed Route loaded');

router.get('/', async (req, res) => {
  try {
    const feed = await parser.parseURL(FEED_URL);

    // Transform specifically for our UI needs
    const items = feed.items.slice(0, 10).map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
      date: new Date(item.pubDate).toLocaleDateString()
    }));

    res.json({
      success: true,
      title: feed.title,
      description: feed.description,
      items: items
    });
  } catch (error) {
    console.error('RSS Parser Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to parse RSS feed',
      details: error.message
    });
  }
});

module.exports = router;
