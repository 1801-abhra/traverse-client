let audioContext = null;
let isUnlocked = false;

// Unlock audio on first user interaction (required for iOS)
export const unlockAudio = () => {
    if (isUnlocked) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    isUnlocked = true;
};

// Play a bell/chime sound
export const playRideSound = () => {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const frequencies = [880, 1100, 880];
        let time = audioContext.currentTime;

        frequencies.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, time + i * 0.15);

            gainNode.gain.setValueAtTime(0, time + i * 0.15);
            gainNode.gain.linearRampToValueAtTime(0.5, time + i * 0.15 + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, time + i * 0.15 + 0.3);

            oscillator.start(time + i * 0.15);
            oscillator.stop(time + i * 0.15 + 0.3);
        });
    } catch (err) {
        console.log('Audio error:', err);
    }
};