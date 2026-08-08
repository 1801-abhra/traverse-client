import React, { useEffect, useState } from 'react';

function Toast({ message, type = 'info', onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 50);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 400);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    const config = {
        accepted: { color: '#e63946', bg: '#1a0000', icon: '🚗', border: '#e63946' },
        success: { color: '#10b981', bg: '#001a0a', icon: '✅', border: '#10b981' },
        info: { color: '#3b82f6', bg: '#00081a', icon: '📍', border: '#3b82f6' },
        warning: { color: '#f59e0b', bg: '#1a0f00', icon: '⚠️', border: '#f59e0b' },
    };

    const c = config[type] || config.info;

    return (
        <div style={{
            position: 'fixed',
            top: visible ? '24px' : '-120px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.color}`,
            color: 'white',
            padding: '14px 18px',
            borderRadius: '14px',
            zIndex: 2000,
            minWidth: '300px',
            maxWidth: '90vw',
            boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${c.color}22`,
            transition: 'top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
            <div style={{
                width: '36px', height: '36px',
                background: c.color + '22',
                border: `1px solid ${c.color}44`,
                borderRadius: '10px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '18px',
                flexShrink: 0
            }}>
                {c.icon}
            </div>
            <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'white' }}>
                    {type === 'accepted' ? 'Ride Accepted!' :
                        type === 'success' ? 'Ride Completed!' :
                            type === 'warning' ? 'Warning' : 'Update'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#999' }}>
                    {message}
                </p>
            </div>
        </div>
    );
}

export default Toast;