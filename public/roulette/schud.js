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
        contactDiv.textContent = "Geen contacten beschikbaar.";
        callBtn.style.display = 'none';
    }
}

// Shake detection
window.addEventListener("devicemotion", function (event) {
    const acc = event.accelerationIncludingGravity;

    const shakeThreshold = 15;
    const now = Date.now();

    if (!acc) return;

    const totalAcceleration = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);

    if (totalAcceleration > shakeThreshold && now - lastShakeTime > 1000) {
        lastShakeTime = now;
        const randomContact = pickRandomContact();
        showContact(randomContact);
    }
});

// Vraag toestemming (voor iOS 13+)
if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
        .then(permissionState => {
            if (permissionState === 'granted') {
                // Je mag schuddetectie gebruiken
            }
        })
        .catch(console.error);
}

