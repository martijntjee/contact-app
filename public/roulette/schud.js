let lastShakeTime = 0;

window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const x = acceleration.x;
    const y = acceleration.y;
    const z = acceleration.z;
    console.log(`Acceleratie: x=${x}, y=${y}, z=${z}`);
    document.getElementById('debug').textContent += `Acceleratie: x=${x}, y=${y}, z=${z}\n`;
});

document.getElementById('debug').textContent += 'Schuddetectie geactiveerd!';

function getContacts() {
    return JSON.parse(localStorage.getItem('contacts') || '[]');
}

function pickRandomContact() {
    const contacts = getContacts();
    if (contacts.length === 0) return null;
    return contacts[Math.floor(Math.random() * contacts.length)];
}

function showContact(contact) {
    const contactDiv = document.getElementById("contact");
    const callBtn = document.getElementById("callBtn");

    if (contact) {
        contactDiv.textContent = `${contact.name} - ${contact.phone}`;
        callBtn.href = `tel:${contact.phone}`;
        callBtn.style.display = 'inline-block';
    } else {
        contactDiv.textContent = "Voeg eerst contacten toe.";
        callBtn.style.display = 'none';
    }
}

function handleShake() {
    const now = Date.now();
    if (now - lastShakeTime > 1000) { // minstens 1 seconde tussen shakes
        lastShakeTime = now;
        const randomContact = pickRandomContact();
        showContact(randomContact);
    }
}

function initGyroShakeDetection() {
    let lastAlpha = null, lastBeta = null, lastGamma = null;
    const threshold = 5;

    function onDeviceOrientation(event) {
        const { alpha, beta, gamma } = event;
        if (lastAlpha !== null) {
            const deltaAlpha = Math.abs(alpha - lastAlpha);
            const deltaBeta = Math.abs(beta - lastBeta);
            const deltaGamma = Math.abs(gamma - lastGamma);

            if ((deltaAlpha + deltaBeta + deltaGamma) > threshold) {
                handleShake();
                navigator.vibrate?.(200);
            }
        }
        lastAlpha = alpha;
        lastBeta = beta;
        lastGamma = gamma;
    }

    const btn = document.getElementById('enableShakeBtn');
    btn.style.display = 'inline-block';

    btn.addEventListener('click', () => {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', onDeviceOrientation);
                        btn.style.display = 'none';
                        alert('Schuddetectie geactiveerd!');
                    } else {
                        alert('Toestemming geweigerd.');
                    }
                })
                .catch(console.error);
        } else {
            // Oudere browsers zonder permissie vraag
            window.addEventListener('deviceorientation', onDeviceOrientation);
            btn.style.display = 'none';
            alert('Schuddetectie geactiveerd!');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initGyroShakeDetection();

    // Laat een willekeurig contact zien als er al contacten zijn
    const initialContact = pickRandomContact();
    showContact(initialContact);
});
