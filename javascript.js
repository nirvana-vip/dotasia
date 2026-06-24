const canvas = document.getElementById('sunCanvas');
const ctx = canvas.getContext('2d');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let imageRects = [];

function updateImageRects() {
    const ids = ['leftImage', 'middleImage', 'rightImage'];
    imageRects = ids.map(id => document.getElementById(id).getBoundingClientRect());
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateImageRects();
}

window.addEventListener('resize', resizeCanvas);
// Also update on load to ensure images are positioned
window.addEventListener('load', updateImageRects);
resizeCanvas();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function drawSun() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();

    // Clipping region for all three images using cached rects
    ctx.beginPath();
    imageRects.forEach(rect => {
        ctx.rect(rect.left, rect.top, rect.width, rect.height);
    });
    ctx.clip();
    
    // Map horizontal mouse position to rotation percentage (0% to 100%)
    const rotationPercent = mouseX / window.innerWidth;
    // Map percentage to actual rotation angle (0 to 360 degrees / 2 PI radians)
    const rotationAngle = rotationPercent * Math.PI * 2;
    
    // Apply canvas rotation centered at the mouse cursor
    ctx.translate(mouseX, mouseY);
    ctx.rotate(rotationAngle);
    ctx.translate(-mouseX, -mouseY);

    ctx.globalCompositeOperation = 'overlay';
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; 
    ctx.lineWidth = 1;

    // Ensure rays are long enough to reach the edges from any point
    const radius = Math.max(canvas.width, canvas.height) * 2;

    for (let i = 0; i < 36; i++) {
        const angle = i * 10 * (Math.PI / 180);
        ctx.moveTo(mouseX, mouseY);
        
        // Rays extending from the cursor position to the edges
        ctx.lineTo(
            mouseX + Math.cos(angle) * radius, 
            mouseY + Math.sin(angle) * radius
        );
    }
    ctx.stroke();
    
    ctx.restore();

    requestAnimationFrame(drawSun);
}

// Start the animation loop
drawSun();

const gifContainer = document.getElementById('gifContainer');
const maxGifs = 30;
const gifs = [];

function createGif() {
    const img = document.createElement('img');
    img.src = 'images/spin.gif';
    img.className = 'spin-gif';
    
    // Random position
    const x = Math.random() * (window.innerWidth - 200);
    const y = Math.random() * (window.innerHeight - 200);
    
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    
    gifContainer.appendChild(img);
    gifs.push(img);
    
    if (gifs.length > maxGifs) {
        const oldest = gifs.shift();
        oldest.style.opacity = '0';
        setTimeout(() => {
            oldest.remove();
        }, 500); // Wait for fade out
    }
}

setInterval(createGif, 500);