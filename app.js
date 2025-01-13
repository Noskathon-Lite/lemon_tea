let mealLog = [];
let isLoggedIn = false; // Track login status
let username = ''; // Store username
let userAllergies = []; // Store user allergies

// Open Login Modal
document.getElementById('openLoginBtn').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'block';
});

// Open Sign Up Modal
document.getElementById('openSignUpBtn').addEventListener('click', function() {
    document.getElementById('signUpModal').style.display = 'block';
});

// Close Login Modal
document.getElementById('closeLoginBtn').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'none';
});

// Close Sign Up Modal
document.getElementById('closeSignUpBtn').addEventListener('click', function() {
    document.getElementById('signUpModal').style.display = 'none';
});

// Handle login form submission
document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault();
    username = document.getElementById('loginEmail').value.split('@')[0]; // Assume username is part of email before "@"
    isLoggedIn = true;
    toggleAuthentication();
    document.getElementById('loginModal').style.display = 'none'; // Close the login modal
});

// Handle signup form submission
document.getElementById('signup').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const usernameInput = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const allergies = document.getElementById('allergies').value;

    // Split allergies string by commas and store them in an array
    userAllergies = allergies ? allergies.split(',').map(item => item.trim().toLowerCase()) : [];

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // For simplicity, we assume signup is successful
    alert(`Welcome ${name}, you have signed up successfully!`);
    username = usernameInput; // Set the username
    isLoggedIn = true;
    toggleAuthentication();
    document.getElementById('signUpModal').style.display = 'none'; // Close the sign-up modal
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    isLoggedIn = false;
    username = '';
    userAllergies = [];
    toggleAuthentication();
});

// Toggle display of authentication forms and main app content
function toggleAuthentication() {
    const authSection = document.querySelector('header');
    const appSection = document.getElementById('appSection');
    const navbar = document.getElementById('navbar');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (isLoggedIn) {
        authSection.style.display = 'none';
        appSection.style.display = 'block';
        navbar.style.display = 'block';
        usernameDisplay.innerText = username; // Display the username in navbar
        // Add logout button
        document.getElementById('logoutBtn').style.display = 'block';
    } else {
        authSection.style.display = 'block';
        appSection.style.display = 'none';
        navbar.style.display = 'none';
        // Hide logout button when not logged in
        document.getElementById('logoutBtn').style.display = 'none';
    }
}

// Placeholder for image upload and Clarifai API integration
document.getElementById('uploadBtn').addEventListener('click', function() {
    if (!isLoggedIn) {
        alert('Please log in first to upload an image!');
        return;
    }
    
    const fileInput = document.getElementById('foodImage');
    if (!fileInput.files.length) {
        alert('Please upload an image!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        // Simulating image analysis and fetching nutritional data
        const foodItem = 'Apple'; // Placeholder for food recognition
        const calories = 95; // Placeholder data
        const protein = 0.5;
        const carbs = 25;
        const fat = 0.3;

        // Check if the food item is in the user's allergy list
        if (checkForAllergies(foodItem)) {
            alert(`Warning: The food item "${foodItem}" contains ingredients that you are allergic to! Do not eat it.`);
            return; // Stop adding the meal log entry if it's an allergy match
        }

        // Add the meal to the meal log
        mealLog.push({
            name: foodItem,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat
        });

        // Update the meal log and progress
        updateMealLog();
    };

    reader.readAsDataURL(file);
});

// Start camera access when the "Open Camera" button is clicked
document.getElementById('openCameraBtn').addEventListener('click', function() {
    if (!isLoggedIn) {
        alert('Please log in first to use the camera!');
        return;
    }
    document.getElementById('cameraSection').style.display = 'block';
    startCamera();
});

// Start the camera and stream video to the video element
function startCamera() {
    const video = document.getElementById('video');
    const constraints = { video: { facingMode: 'environment' } };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(error) {
            alert('Error accessing the camera: ' + error.message);
        });
}

// Capture the photo from the camera
document.getElementById('captureBtn').addEventListener('click', function() {
    if (!isLoggedIn) {
        alert('Please log in first to capture an image!');
        return;
    }

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const capturedImage = document.getElementById('capturedImage');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas image to a data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Display the captured image
    capturedImage.src = dataUrl;
    capturedImage.style.display = 'block';
    
    // Optionally, process the image (e.g., send to the API)
    processImage(dataUrl);
});

// Process the captured image (e.g., send to an API for analysis)
function processImage(imageDataUrl) {
    if (!isLoggedIn) {
        alert('Please log in first to process an image!');
        return;
    }

    // Simulate image processing and analysis (e.g., Clarifai or another API)
    const foodItem = 'Apple'; // Placeholder for food recognition
    const calories = 95; // Placeholder data
    const protein = 0.5;
    const carbs = 25;
    const fat = 0.3;

    // Check if the food item is in the user's allergy list
    if (checkForAllergies(foodItem)) {
        alert(`Warning: The food item "${foodItem}" contains ingredients that you are allergic to! Do not eat it.`);
        return; // Stop adding the meal log entry if it's an allergy match
    }

    // Add the meal to the meal log
    mealLog.push({
        name: foodItem,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat
    });

    // Update the meal log and progress
    updateMealLog();
}

// Function to check if the food item contains any of the user's allergies
function checkForAllergies(foodItem) {
    // Simulate a list of common allergens (this would normally come from an API or database)
    const commonAllergens = {
        "apple": ["apple"], // Example: apple could have "apple" as an allergen
        "peanut": ["peanut", "peanuts"],
        "milk": ["milk", "dairy"],
        // Add more common allergens as needed
    };

    // Check if the foodItem exists in the allergies dictionary
    const foodLower = foodItem.toLowerCase();
    for (const allergen in commonAllergens) {
        if (foodLower.includes(allergen) && userAllergies.includes(allergen)) {
            return true; // The food contains an allergen
        }
    }

    return false; // No allergens detected in the food item
}

// Function to update the meal log table
function updateMealLog() {
    const tableBody = document.querySelector('#mealLogTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    mealLog.forEach(meal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${meal.name}</td>
            <td>${meal.calories}</td>
            <td>${meal.protein}</td>
            <td>${meal.carbs}</td>
            <td>${meal.fat}</td>
        `;
        tableBody.appendChild(row);
    });

    updateDashboard();
}

// Function to update the progress dashboard
function updateDashboard() {
    const totalCalories = mealLog.reduce((total, meal) => total + meal.calories, 0);
    const totalProtein = mealLog.reduce((total, meal) => total + meal.protein, 0);
    const totalCarbs = mealLog.reduce((total, meal) => total + meal.carbs, 0);
    const totalFat = mealLog.reduce((total, meal) => total + meal.fat, 0);

    const dashboard = document.getElementById('dashboardContent');
    dashboard.innerHTML = `
        <p>Total Calories: ${totalCalories} kcal</p>
        <p>Total Protein: ${totalProtein} g</p>
        <p>Total Carbs: ${totalCarbs} g</p>
        <p>Total Fat: ${totalFat} g</p>
    `;
}
