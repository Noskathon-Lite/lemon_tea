// Check authentication status
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
}

// Camera handling
let stream = null;
let isScanning = false;

async function initializeCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
        });
        const videoElement = document.getElementById('camera');
        videoElement.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please make sure you have granted camera permissions.');
    }
}

// Scanning functionality
async function scanFood() {
    if (!stream) {
        alert('Camera not initialized');
        return;
    }

    const canvas = document.getElementById('canvas');
    const video = document.getElementById('camera');
    const context = canvas.getContext('2d');

    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg');

    // Here you would normally send this data to your Python backend
    // For now, we'll simulate a response
    simulateAnalysis();
}

// Simulate food analysis (replace this with actual API calls to your Python backend)
function simulateAnalysis() {
    // Get user's allergies
    const userAllergies = JSON.parse(localStorage.getItem('userAllergies') || '[]');
    
    // Simulated data
    const mockResults = {
        food: 'Peanut Butter Sandwich',
        allergens: ['Peanuts', 'Gluten'],
        calories: 354
    };

    // Check for allergy warnings
    const allergyWarnings = mockResults.allergens.filter(allergen => 
        userAllergies.includes(allergen.toLowerCase())
    );

    displayResults(mockResults, allergyWarnings);
}

// Display results in the UI
function displayResults(results, allergyWarnings) {
    // Update food info
    document.getElementById('foodInfo').innerHTML = `
        <p>Detected: ${results.food}</p>
        ${allergyWarnings.length > 0 ? 
            `<p class="warning">⚠️ Warning: Contains allergens you're sensitive to!</p>` 
            : ''}
    `;

    // Update allergens list
    const allergensList = document.getElementById('allergensList');
    allergensList.innerHTML = results.allergens
        .map(allergen => `
            <li class="${allergyWarnings.includes(allergen) ? 'warning' : ''}">
                ${allergen}
                ${allergyWarnings.includes(allergen) ? ' ⚠️' : ''}
            </li>
        `)
        .join('');

    // Update calorie count with animation
    const calorieDisplay = document.getElementById('calorieCount');
    animateNumber(calorieDisplay, 0, results.calories, 1000);
}

// Animate number counting up
function animateNumber(element, start, end, duration) {
    let current = start;
    const range = end - start;
    const increment = range / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeCamera();
    
    document.getElementById('scanButton').addEventListener('click', () => {
        if (!isScanning) {
            isScanning = true;
            scanFood().finally(() => {
                isScanning = false;
            });
        }
    });
});