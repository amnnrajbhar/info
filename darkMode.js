// Create and append the zoom overlay
function createZoomOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    document.body.appendChild(overlay);
    return overlay;
}

// Function to get button position
function getButtonPosition(button) {
    const rect = button.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

// Function to toggle dark mode with animation
function toggleDarkMode(event) {
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle.querySelector('i');
    
    // Add clicked class to button
    darkModeToggle.classList.add('clicked');
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.zoom-overlay');
    if (!overlay) {
        overlay = createZoomOverlay();
    }
    
    // Get button position and set transform origin
    const pos = getButtonPosition(darkModeToggle);
    overlay.style.setProperty('--x', `${pos.x}px`);
    overlay.style.setProperty('--y', `${pos.y}px`);
    
    // Show overlay and start zoom animation
    requestAnimationFrame(() => {
        overlay.classList.add('active');
        
        // Toggle dark mode after the zoom animation starts
        setTimeout(() => {
            const isDarkMode = body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            localStorage.setItem('darkMode', isDarkMode);
            
            // Update button icon
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
            
            // Remove clicked class and hide overlay after animation completes
            setTimeout(() => {
                darkModeToggle.classList.remove('clicked');
                overlay.classList.remove('active');
            }, 500);
        }, 250);
    });
}

// Initialize dark mode based on saved preference
function initializeDarkMode() {
    const darkModeSaved = localStorage.getItem('darkMode');
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle.querySelector('i');
    
    if (darkModeSaved === 'true') {
        body.classList.add('dark-mode');
        icon.className = 'fas fa-sun';
    } else {
        body.classList.remove('dark-mode');
        icon.className = 'fas fa-moon';
    }
}

// Check for saved user preference when the page loads
document.addEventListener('DOMContentLoaded', initializeDarkMode);

// Update button position on window resize
window.addEventListener('resize', () => {
    const overlay = document.querySelector('.zoom-overlay');
    if (overlay && overlay.classList.contains('active')) {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const pos = getButtonPosition(darkModeToggle);
        overlay.style.setProperty('--x', `${pos.x}px`);
        overlay.style.setProperty('--y', `${pos.y}px`);
    }
}); 