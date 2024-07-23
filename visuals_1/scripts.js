// Select elements
const asciiArt = document.getElementById('asciiArt');
const scrollArrow = document.getElementById('scroll-arrow');
const videoContainers = document.querySelectorAll('.video-container');

const artFrames = [
    `▒█░▒█ ▒█░▒█ ▒█▄░▒█ ▀▀█▀▀ ▒█▀▀▀ ▒█▀▀█ 
▒█▀▀█ ▒█░▒█ ▒█▒█▒█ ░▒█░░ ▒█▀▀▀ ▒█▄▄▀ 
▒█░▒█ ░▀▄▄▀ ▒█░░▀█ ░▒█░░ ▒█▄▄▄ ▒█░▒█`
];

let currentFrame = 0;

function displayFrame() {
    asciiArt.textContent = artFrames[currentFrame];
    currentFrame = (currentFrame + 1) % artFrames.length;
}

setInterval(displayFrame, 2000);

// Pulsing text color for ASCII art and arrow
function pulseColor() {
    const r = Math.sin(Date.now() * 0.01) * 127 + 128;
    const g = Math.sin(Date.now() * 0.01 + 2) * 127 + 128;
    const b = Math.sin(Date.now() * 0.01 + 4) * 127 + 128;
    const color = `rgb(${r}, ${g}, ${b})`;
    asciiArt.style.color = color;
    if (scrollArrow) {
        scrollArrow.style.color = color;
    }
    requestAnimationFrame(pulseColor);
}

pulseColor();

// Background stars
const starfield = document.createElement('div');
starfield.id = 'starfield';
document.body.appendChild(starfield);

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${Math.random() * 3 + 1}s`;
    starfield.appendChild(star);
}

for (let i = 0; i < 100; i++) {
    createStar();
}

function animateStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        const y = parseFloat(star.style.top);
        star.style.top = y > 100 ? '0%' : `${y + 0.1}%`;
    });
    requestAnimationFrame(animateStars);
}

animateStars();

// Show video on scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    videoContainers.forEach(container => {
        if (scrollPosition > container.offsetTop - windowHeight * 0.5) {
            container.classList.add('visible');
        } else {
            container.classList.remove('visible');
        }
    });

    if (scrollArrow) {
        if (scrollPosition + windowHeight >= documentHeight - 50) {
            scrollArrow.style.display = 'none';
        } else {
            scrollArrow.style.display = 'block';
        }
    }
});

// Video control
let vimeoPlayers = [];

// Initialize Vimeo players
document.querySelectorAll('.video-container iframe').forEach((iframe, index) => {
    const player = new Vimeo.Player(iframe);
    vimeoPlayers.push(player);
    setupVideoObserver(iframe.parentElement, player, index);
});

function setupVideoObserver(videoContainer, player, index) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                player.play().catch(error => {
                    console.error("Error playing video:", error);
                });
            } else {
                player.pause().catch(error => {
                    console.error("Error pausing video:", error);
                });
            }
        });
    }, { threshold: 0.5 });

    observer.observe(videoContainer);

    // Add click event listener to play/pause the video
    videoContainer.addEventListener('click', () => {
        player.getPaused().then(paused => {
            if (paused) {
                player.play().catch(error => {
                    console.error("Error playing video:", error);
                });
            } else {
                player.pause().catch(error => {
                    console.error("Error pausing video:", error);
                });
            }
        });
    });
}

// Add keyboard controls for mute/unmute
document.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
        vimeoPlayers.forEach(player => {
            player.getVolume().then(volume => {
                if (volume === 0) {
                    player.setVolume(1);
                } else {
                    player.setVolume(0);
                }
            });
        });
    }
});

// Handle resize and orientation change
window.addEventListener('resize', handleResize);
window.addEventListener('orientationchange', handleResize);

function handleResize() {
    // Adjust ASCII art size
    if (window.innerWidth <= 480) {
        asciiArt.style.fontSize = '14px';
    } else if (window.innerWidth <= 768) {
        asciiArt.style.fontSize = '16px';
    } else {
        asciiArt.style.fontSize = '20px';
    }

    // Recalculate video container heights
    videoContainers.forEach(container => {
        container.style.height = `${window.innerHeight}px`;
    });
}

// Initial call to set up sizes
handleResize();
