// schud.js
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

function initShakeDetection() {
    let isRequestingPermission = false;

    function startShakeDetection() {
        let lastX = null, lastY = null, lastZ = null;
        const threshold = 2;                                         // Of 3, voor iets minder gevoelig
        window.addEventListener("devicemotion", (event) => {
            const acceleration = event.accelerationIncludingGravity ||
                { x: 0, y: 0, z: 0 };

            if (lastX !== null) {
                const deltaX = Math.abs(acceleration.x - lastX);
                const deltaY = Math.abs(acceleration.y - lastY);
                const deltaZ = Math.abs(acceleration.z - lastZ);

                if ((deltaX + deltaY + deltaZ) > threshold) {
                    handleShake();
                    navigator.vibrate?.(200); // feedback
                }

            }

            lastX = acceleration.x;
            lastY = acceleration.y;
            lastZ = acceleration.z;
        });
    }

    // Voor iOS 13+
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        document.body.addEventListener('click', () => {
            if (!isRequestingPermission) {
                isRequestingPermission = true;
                DeviceMotionEvent.requestPermission()
                    .then(permissionState => {
                        isRequestingPermission = false;
                        if (permissionState === 'granted') {
                            startShakeDetection();
                        }
                    })
                    .catch(console.error);
            }
        }, { once: true });

        // alert('Klik ergens op het scherm om toestemming te vragen voor schudden');
    } else {
        // Andere browsers
        startShakeDetection();
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initShakeDetection();

    // Laat zien dat het werkt
    const initialContact = pickRandomContact();
    showContact(initialContact);
});