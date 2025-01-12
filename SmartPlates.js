let mealLog = [];
let isLoggedIn = false; 
let username = ''; 
let userAllergies = []; 

document.getElementById('openLoginBtn').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'block';
});

document.getElementById('openSignUpBtn').addEventListener('click', function() {
    document.getElementById('signUpModal').style.display = 'block';
});

document.getElementById('closeLoginBtn').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'none';
});

document.getElementById('closeSignUpBtn').addEventListener('click', function() {
    document.getElementById('signUpModal').style.display = 'none';
});

document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault();
    username = document.getElementById('loginEmail').value.split('@')[0]; 
    isLoggedIn = true;
    toggleAuthentication();
    document.getElementById('loginModal').style.display = 'none'; l
});

document.getElementById('signup').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const usernameInput = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const allergies = document.getElementById('allergies').value;

    userAllergies = allergies ? allergies.split(',').map(item => item.trim().toLowerCase()) : [];


    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

   
    alert(`Welcome ${name}, you have signed up successfully!`);
    username = usernameInput; 
    isLoggedIn = true;
    toggleAuthentication();
    document.getElementById('signUpModal').style.display = 'none';
});

function toggleAuthentication() {
    const authSection = document.querySelector('header');
    const appSection = document.getElementById('appSection');
    const navbar = document.getElementById('navbar');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (isLoggedIn) {
        authSection.style.display = 'none';
        appSection.style.display = 'block';
        navbar.style.display = 'block';
        usernameDisplay.innerText = username; 
    } else {
        authSection.style.display = 'block';
        appSection.style.display = 'none';
        navbar.style.display = 'none';
    }
}
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
       
        const foodItem = 'Apple'; 
        const calories = 95; 
        const protein = 0.5;
        const carbs = 25;
        const fat = 0.3;
        if (checkForAllergies(foodItem)) {
            alert(`Warning: The food item "${foodItem}" contains ingredients that you are allergic to! Do not eat it.`);
            return; 
        }
        mealLog.push({
            name: foodItem,
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat
        });

        updateMealLog();
    };

    reader.readAsDataURL(file);
});

document.getElementById('openCameraBtn').addEventListener('click', function() {
    if (!isLoggedIn) {
        alert('Please log in first to use the camera!');
        return;
    }
    document.getElementById('cameraSection').style.display = 'block';
    startCamera();
});

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

    const dataUrl = canvas.toDataURL('image/png');

    capturedImage.src = dataUrl;
    capturedImage.style.display = 'block';
        processImage(dataUrl);
});

function processImage(imageDataUrl) {
    if (!isLoggedIn) {
        alert('Please log in first to process an image!');
        return;
    }

    
    const foodItem = 'Apple'; 
    const calories = 95; 
    const protein = 0.5;
    const carbs = 25;
    const fat = 0.3;

    if (checkForAllergies(foodItem)) {
        alert(`Warning: The food item "${foodItem}" contains ingredients that you are allergic to! Do not eat it.`);
        return; 
    }

    mealLog.push({
        name: foodItem,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat
    });

    updateMealLog();
}

function checkForAllergies(foodItem) {
    const commonAllergens = {
        "apple": ["apple"],
        "peanut": ["peanut", "peanuts"],
        "milk": ["milk", "dairy"],
    };

    const foodLower = foodItem.toLowerCase();
    for (const allergen in commonAllergens) {
        if (foodLower.includes(allergen) && userAllergies.includes(allergen)) {
            return true; 
        }
    }

    return false; 
}

function updateMealLog() {
    const tableBody = document.querySelector('#mealLogTable tbody');
    tableBody.innerHTML = ''; 

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
