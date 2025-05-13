console.log('javascript loaded');

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    });
}

import Camera from 'camera';

const camera = new Camera();
const videoElement = document.getElementById('cameraFeed');
const startButton = document.getElementById('startCamera');
const stopButton = document.getElementById('stopCamera');

startButton.addEventListener('click', async () => {
    videoElement.srcObject = await camera.getStream();
    videoElement.play();
});

stopButton.addEventListener('click', () => {
    camera.stopStream();
    videoElement.srcObject = null;
});

// Get DOM elements
const takePhotoButton = document.getElementById('takePhoto');
const canvas = document.getElementById('photoCanvas');
const context = canvas.getContext('2d');

// Capture and store image
takePhotoButton.addEventListener('click', () => {
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Save canvas content as image in localStorage
    const imageData = canvas.toDataURL('image/png');
    localStorage.setItem('savedPhoto', imageData);
});

const profilesContainer = document.getElementById('profilesContainer');
const profileTemplate = document.getElementById('profileTemplate');

fetch('/api/contacts')
    .then(res => res.json())
    .then(contacts => {
        contacts.forEach(contact => {
            const clone = profileTemplate.content.cloneNode(true);
            clone.querySelector('.name').textContent = contact.name;
            clone.querySelector('.email').textContent = contact.email;
            profilesContainer.appendChild(clone);
        });
    })
    .catch(err => {
        console.error('Failed to load contacts:', err);
    });

