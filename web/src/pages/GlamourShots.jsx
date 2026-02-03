import React, { useState } from 'react';
import '../App.css';

const GlamourShots = () => {
    const [style, setStyle] = useState('Cyberpunk');
    const [generating, setGenerating] = useState(false);
    const [gallery, setGallery] = useState([]);

    const styles = ['Cyberpunk', 'Victorian', 'Abstract', 'Vaporwave', 'Noir', 'Renaissance'];

    const handleGenerate = () => {
        setGenerating(true);
        // Mock generation delay
        setTimeout(() => {
            const newShot = {
                id: Date.now(),
                style: style,
                timestamp: new Date().toLocaleTimeString(),
                // Placeholder gradient for now
                color: `hsl(${Math.random() * 360}, 70%, 60%)`
            };
            setGallery([newShot, ...gallery]);
            setGenerating(false);
        }, 2000);
    };

    return (
        <div className="page-container glamour-shots">
            <header className="section-header">
                <h1>✨ Glamour Shots</h1>
                <p>Capture your agent's best side in any dimension.</p>
            </header>

            <div className="studio-interface">
                <div className="controls">
                    <label>Select Aesthetic:</label>
                    <select value={style} onChange={(e) => setStyle(e.target.value)}>
                        {styles.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button
                        className="btn btn-primary"
                        onClick={handleGenerate}
                        disabled={generating}
                    >
                        {generating ? 'Developing...' : '📸 Snap Portrait'}
                    </button>
                </div>

                <div className="viewfinder">
                    {generating ? (
                        <div className="flash-animation"></div>
                    ) : (
                        <div className="placeholder-cam">Ready to Shoot</div>
                    )}
                </div>
            </div>

            <div className="gallery-grid">
                {gallery.map(shot => (
                    <div key={shot.id} className="polaroid">
                        <div className="photo" style={{ background: shot.color }}>
                            <span>{shot.style} Agent</span>
                        </div>
                        <div className="caption">{shot.timestamp} • {shot.style}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GlamourShots;
