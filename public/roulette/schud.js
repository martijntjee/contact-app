let lastShakeTime = 0;

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
    if (now - lastShakeTime > 1000) { // Minstens 1 seconde tussen shakes
        lastShakeTime = now;
        const randomContact = pickRandomContact();
        showContact(randomContact);
    }
}

function initGyroShakeDetection() {
    let lastAlpha = null, lastBeta = null, lastGamma = null;
    const threshold = 5; // drempel, hogere waarde = minder gevoelig

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

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        let isRequestingPermission = false;
        document.body.addEventListener('click', () => {
            if (!isRequestingPermission) {
                isRequestingPermission = true;
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        isRequestingPermission = false;
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', onDeviceOrientation);
                        } else {
                            alert('Toestemming voor gyroscoop geweigerd.');
                        }
                    })
                    .catch(console.error);
            }
        }, { once: true });

        alert('Klik ergens op het scherm om toestemming te geven voor schuddetectie');
    } else {
        // Voor browsers zonder toestemming-vraag
        window.addEventListener('deviceorientation', onDeviceOrientation);
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initGyroShakeDetection();

    // Laat zien dat het werkt
    const initialContact = pickRandomContact();
    showContact(initialContact);
});
