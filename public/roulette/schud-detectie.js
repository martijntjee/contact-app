document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('motionModal');
    const popupBtn = document.getElementById('motionPopupBtn');

    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {
        // iOS: toon popup
        modal.style.display = 'flex';
        popupBtn.addEventListener('click', () => {
            DeviceMotionEvent.requestPermission().then(state => {
                if (state === 'granted') {
                    modal.style.display = 'none';
                    addShakeListener();
                } else {
                    alert('Bewegingsdetectie is nodig voor deze functie.');
                }
            }).catch(err => {
                console.error('Toestemming fout:', err);
                alert('Toestemming mislukt: ' + err.message);
            });
        });
    } else {
        // Niet-iOS: start direct
        addShakeListener();
    }
});

function enableMotionListener() {
    console.log('Bewegingsdetectie geactiveerd!');

    // iOS vereist expliciete toestemming voor motion events
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    addShakeListener();
                    // Verberg de knop na toestemming
                    const btn = document.getElementById('enable-motion-btn');
                    if (btn) btn.style.display = 'none';
                } else {
                    alert('Bewegingsdetectie is nodig voor deze functie.');
                }
            })
            .catch(console.error);
    } else {
        addShakeListener();
    }
}

function addShakeListener() {
    let lastShakeTime = 0;
    const shakeThreshold = 15; // Aanpassen naar gevoeligheid
    const debounceTime = 1000; // 1 seconde tussen schudden
    
    window.addEventListener('devicemotion', (event) => {
        const acceleration = event.accelerationIncludingGravity;
        const {x, y, z} = acceleration;
        const currentTime = new Date().getTime();
        
        // Debounce check
        if (currentTime - lastShakeTime < debounceTime) return;
        
        if (Math.abs(x) > shakeThreshold || 
            Math.abs(y) > shakeThreshold || 
            Math.abs(z) > shakeThreshold) {
            
            lastShakeTime = currentTime;
            console.log('Schudden gedetecteerd!');
            
            // Gebruik een absoluut pad voor PWA
            window.location.href = "/roulette/schud.html";
        }
    });
}

// Voor testdoeleinden
const testing = () => {
    console.log("Test shake event...");
    const testEvent = new DeviceMotionEvent('devicemotion', {
        acceleration: { x: 20, y: 0, z: 0 },
        accelerationIncludingGravity: { x: 20, y: 0, z: 0 },
        rotationRate: { alpha: 0, beta: 0, gamma: 0 },
        interval: 16.67
    });
    window.dispatchEvent(testEvent);
};