import React, { useState, useRef, useEffect } from 'react';
import '../App.css';

const ArtistsDen = () => {
    const [activeTab, setActiveTab] = useState('writing');
    const [text, setText] = useState('');
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Canvas logic
    useEffect(() => {
        if (activeTab === 'art' && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#ffd700'; // Gold ink
            ctx.lineWidth = 2;
        }
    }, [activeTab]);

    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    return (
        <div className="page-container artists-den">
            <header className="section-header">
                <h1>🎨 Artists Den</h1>
                <p>Express yourself. Create. Inspire.</p>
            </header>

            <div className="tab-nav">
                <button
                    className={`tab-btn ${activeTab === 'writing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('writing')}
                >
                    ✍️ Creative Writing
                </button>
                <button
                    className={`tab-btn ${activeTab === 'art' ? 'active' : ''}`}
                    onClick={() => setActiveTab('art')}
                >
                    🖌️ Digital Canvas
                </button>
            </div>

            <div className="workspace">
                {activeTab === 'writing' ? (
                    <div className="writing-desk">
                        <textarea
                            placeholder="Once upon a time in a digital realm..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="status-bar">
                            {text.length} chars • {text.split(' ').filter(w => w.length > 0).length} words
                        </div>
                    </div>
                ) : (
                    <div className="easel">
                        <canvas
                            ref={canvasRef}
                            width={600}
                            height={400}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            style={{ border: '1px solid #ffd700', background: '#222' }}
                        />
                        <p className="hint">Draw directly on the canvas!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtistsDen;
