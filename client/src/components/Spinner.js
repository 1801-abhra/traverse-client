import React from 'react';

function Spinner({ text = 'Loading...' }) {
    return (
        <div style={styles.container}>
            <div style={styles.spinner} />
            <p style={styles.text}>{text}</p>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '3px solid #1a1a1a',
        borderTop: '3px solid #e63946',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    },
    text: {
        color: '#666',
        marginTop: '16px',
        fontSize: '14px'
    }
};

// Add CSS animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default Spinner; 
