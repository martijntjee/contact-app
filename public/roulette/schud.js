let lastShakeTime = 0;

// Detectie op basis van acceleratie
window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity;
    const x = acceleration.x;
    const y = acceleration.y;
    const z = acceleration.z;
    console.log(`Acceleratie: x=${x}, y=${y}, z=${z}`);
    if (Math.abs(x) > 15 || Math.abs(y) > 15 || Math.abs(z) > 15) {
        const debug = document.getElementById('debug');
        if (debug) {
            debug.textContent += `Acceleratie: x=${x}, y=${y}, z=${z}\n`;
        }

        const now = Date.now();
        if (now - lastShakeTime > 1000) {
            lastShakeTime = now;
            window.location.href = 'schud.html';
        }
    }
});

const debug = document.getElementById('debug');
if (debug) debug.textContent += 'Schuddetectie geactiveerd!\n';

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
    if (now - lastShakeTime > 1000) {
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

    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(state => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', onDeviceOrientation);
                    btn.style.display = 'none';
                    console.log('Schuddetectie automatisch geactiveerd!');
                } else {
                    btn.style.display = 'inline-block';
                    btn.addEventListener('click', () => {
                        DeviceOrientationEvent.requestPermission()
                            .then(newState => {
                                if (newState === 'granted') {
                                    window.addEventListener('deviceorientation', onDeviceOrientation);
                                    btn.style.display = 'none';
                                    alert('Schuddetectie geactiveerd!');
                                } else {
                                    alert('Toestemming geweigerd.');
                                }
                            });
                    });
                }
            })
            .catch(err => {
                console.error('Fout bij vragen van toestemming:', err);
                btn.style.display = 'inline-block';
            });
    } else {
        window.addEventListener('deviceorientation', onDeviceOrientation);
        btn.style.display = 'none';
        console.log('Schuddetectie gestart zonder toestemming.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGyroShakeDetection();

    const initialContact = pickRandomContact();
    showContact(initialContact);
});
