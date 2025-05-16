function enableMotionListener() {
    console.log('Bewegingsdetectie geactiveerd!');

    // iOS vereist expliciete toestemming voor motion events
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    addShakeListener();
                } else {
                    alert('Bewegingsdetectie geweigerd.');
                }
            })
            .catch(console.error);
    } else {
        addShakeListener();
    }
}

function addShakeListener() {
    window.addEventListener('devicemotion', (event) => {
        const acceleration = event.accelerationIncludingGravity;
        const x = acceleration.x;
        const y = acceleration.y;
        const z = acceleration.z;
        console.log(`Acceleratie: x=${x}, y=${y}, z=${z}`);
        if (Math.abs(x) > 15 || Math.abs(y) > 15 || Math.abs(z) > 15) {
            window.location.href = "/roulette/schud.html"; // Gebruik absoluut pad voor PWA!
        }
    });
}

enableMotionListener();

const testing = () => {
    const testEvent = new DeviceMotionEvent('devicemotion', {
        acceleration: {
            x: 20,
            y: 0,
            z: 0
        },
        accelerationIncludingGravity: {
            x: 20,
            y: 0,
            z: 0
        }
    });
    window.dispatchEvent(testEvent);
};