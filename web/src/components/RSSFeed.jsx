import { useState, useEffect } from 'react';
import './RSSFeed.css'; // We'll create this or add to App.css

const RSSFeed = () => {
    const [feedData, setFeedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await fetch('/api/v1/feed');
                const data = await res.json();

                if (data.success) {
                    setFeedData(data);
                } else {
                    setError('Failed to load news');
                }
            } catch (err) {
                console.error('Feed fetch error:', err);
                setError('Could not connect to feed');
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    if (loading) return <div className="rss-loader">Loading Updates...</div>;
    if (error) return <div className="rss-error">{error}</div>;
    if (!feedData || !feedData.items) return null;

    return (
        <div className="rss-feed-container">
            <h3 className="rss-header">📡 XMRT Updates</h3>
            <div className="rss-list">
                {feedData.items.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rss-item"
                    >
                        <h4 className="rss-title">{item.title}</h4>
                        <span className="rss-date">{item.date}</span>
                        {item.contentSnippet && (
                            <p className="rss-snippet">
                                {item.contentSnippet.substring(0, 80)}...
                            </p>
                        )}
                    </a>
                ))}
            </div>
            <a href="https://paragraph.xyz/@xmrt" target="_blank" className="rss-footer-link">
                Read on Paragraph →
            </a>
        </div>
    );
};

export default RSSFeed;
