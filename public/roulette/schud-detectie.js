function enableMotionListener() {
    window.addEventListener('devicemotion', (event) => {
        const acceleration = event.accelerationIncludingGravity;
        const x = acceleration.x;
        const y = acceleration.y;
        const z = acceleration.z;
        console.log(`Acceleratie: x=${x}, y=${y}, z=${z}`);
        if (Math.abs(x) > 15 || Math.abs(y) > 15 || Math.abs(z) > 15) {
            window.location.href = "schud.html";
        }
    });

}

enableMotionListener();