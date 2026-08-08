import React, { useEffect, useState } from 'react';

function Toast({ message, type = 'info', onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Slide in
        setTimeout(() => setVisible(true), 50);
        // Auto close after 3 seconds
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const colors = {
        success: '#10b981',
        info: '#3b82f6',
        warning: '#f59e0b',
        accepted: '#e63946'
    };

    return (
        <div style={{
            position: 'fixed',
            top: visible ? '20px' : '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111',
            border: `1px solid ${colors[type] || colors.info}`,
            borderLeft: `4px solid ${colors[type] || colors.info}`,
            color: 'white',
            padding: '14px 20px',
            borderRadius: '12px',
            zIndex: 2000,
            minWidth: '280px',
            maxWidth: '90vw',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            transition: 'top 0.3s ease',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            <span style={{ fontSize: '20px' }}>
                {type === 'accepted' ? '🚗' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span>{message}</span>
        </div>
    );
}

export default Toast;