let lastShakeTime = 0;
const SHAKE_THRESHOLD = 15;
const DEBOUNCE_TIME = 1000;

function debugLog(message) {
  const debug = document.getElementById('debug');
  if (debug) {
    debug.textContent += `${new Date().toLocaleTimeString()}: ${message}\n`;
    debug.scrollTop = debug.scrollHeight;
  }
}

function getContacts() {
  try {
    return JSON.parse(localStorage.getItem('contacts') || '[]');
  } catch (e) {
    debugLog('Fout bij laden contacten: ' + e.message);
    return [];
  }
}

function pickRandomContact() {
  const contacts = getContacts();
  return contacts.length ? contacts[Math.floor(Math.random() * contacts.length)] : null;
}

function showContact(contact) {
  const contactDiv = document.getElementById("contact");
  const callBtn = document.getElementById("callBtn");

  if (contact) {
    contactDiv.textContent = `${contact.name}\n${contact.phone}`;
    callBtn.href = `tel:${contact.phone}`;
    callBtn.style.display = 'inline-block';
    debugLog(`Contact geselecteerd: ${contact.name}`);
  } else {
    contactDiv.textContent = "Voeg eerst contacten toe in de app";
    callBtn.style.display = 'none';
  }
}

function handleShake() {
  const now = Date.now();
  if (now - lastShakeTime > DEBOUNCE_TIME) {
    lastShakeTime = now;
    if (navigator.vibrate) navigator.vibrate(200);
    const randomContact = pickRandomContact();
    showContact(randomContact);
  }
}

function setupMotionDetection() {
  window.addEventListener('devicemotion', (event) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    debugLog(`X: ${acc.x?.toFixed(2)} Y: ${acc.y?.toFixed(2)} Z: ${acc.z?.toFixed(2)}`);
    
    if (Math.abs(acc.x) > SHAKE_THRESHOLD || 
        Math.abs(acc.y) > SHAKE_THRESHOLD || 
        Math.abs(acc.z) > SHAKE_THRESHOLD) {
      handleShake();
    }
  });
}

function requestMotionPermission() {
  if (typeof DeviceMotionEvent !== 'undefined' && 
      typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          setupMotionDetection();
          document.getElementById('enableMotionBtn').style.display = 'none';
          debugLog('Bewegingsdetectie geactiveerd!');
        } else {
          debugLog('Toestemming geweigerd voor bewegingsdetectie');
        }
      })
      .catch(err => {
        debugLog('Fout bij aanvragen toestemming: ' + err.message);
      });
  } else {
    setupMotionDetection();
    document.getElementById('enableMotionBtn').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  debugLog('App gestart');
  showContact(pickRandomContact());

  const motionBtn = document.getElementById('enableMotionBtn');
  motionBtn.addEventListener('click', () => {
    debugLog('Toestemming gevraagd...');
    requestMotionPermission();
  });

  // Voor niet-iOS devices direct activeren
  if (typeof DeviceMotionEvent === 'undefined' || 
      typeof DeviceMotionEvent.requestPermission !== 'function') {
    requestMotionPermission();
  }
});