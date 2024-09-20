document.addEventListener('DOMContentLoaded', function() {
    // Collect screen and window dimensions
    var screenWidth = window.screen.width;
    var screenHeight = window.screen.height;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
    var browserName = getBrowserName();

    // Display user information
    displayUserInfo(screenWidth, screenHeight, windowWidth, windowHeight, deviceType, browserName);

    const consentButton = document.getElementById('consentButton');
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    // Add change event listener to checkboxes to handle checked state animation
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const parentDiv = checkbox.closest('.checkbox-group');
            if (checkbox.checked) {
                parentDiv.classList.add("checked");
                parentDiv.classList.remove("unchecked");
            } else {
                parentDiv.classList.add("unchecked");
                parentDiv.classList.remove("checked");
            }
        });
    });

    consentButton.addEventListener('click', function(event) {
        // Check if all checkboxes are checked
        let allChecked = true;

        checkboxes.forEach(function(checkbox) {
            const parentDiv = checkbox.closest('.checkbox-group');
            
            if (!checkbox.checked) {
                allChecked = false;
                parentDiv.classList.add("unchecked");
                parentDiv.classList.remove("checked");
            } else {
                parentDiv.classList.add("checked");
                parentDiv.classList.remove("unchecked");
            }
        });

        if (!allChecked) {
            event.preventDefault();
            return; // Exit the function if not all checkboxes are checked
        }

         // Clear local storage before starting the experiment

        localStorage.clear();

        // Capture the current timestamp for consented_at
        const consentedAt = new Date().toISOString();

        // Capture the UTM source from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const recruitmentSource = urlParams.get('utm_source') || 'direct';
        console.log('Recruitment source:', recruitmentSource);
        
        const sonaID = urlParams.get('sona_id') || 'non-Sona'; 
        const clickWorkerId = urlParams.get('user_id') || 'non-Clickworker'; 

              // Save recruitmentSource to local storage
        localStorage.setItem('recruitment_source', recruitmentSource);
        localStorage.setItem('sona_id', sonaID);
        localStorage.setItem('clickworker_id', clickWorkerId);


        // Prepare data to be sent
        var formData = new FormData();
        formData.append('screen_width', screenWidth);
        formData.append('screen_height', screenHeight);
        formData.append('window_width', windowWidth);
        formData.append('window_height', windowHeight);
        formData.append('device_type', deviceType);
        formData.append('consented_at', consentedAt);  // Add the consent timestamp
        formData.append('recruitment_source', recruitmentSource);
        formData.append('sona_id', sonaID);
        formData.append('clickworker_id', clickWorkerId);

       
        // Print FormData to the console
for (var pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
}
        // Send data to the server
        fetch('./submit_consent.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from server:', data);
            if (data.user_id) {
                // Store user_id in localStorage or sessionStorage
                localStorage.setItem('user_id', data.user_id);
                // Set testRound to 'pre' when the experiment starts
                localStorage.setItem('testRound', 'pre');

                console.log('User ID and testRound stored in localStorage:', {
                    user_id: data.user_id,
                    testRound: 'pre'
                });
                // Update this line to reflect the new location of demographics.html
                window.location.href = 'pages/demographics.html';
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while processing your request: ' + error.message + '\n\nContinuing without saving data.');
            
            // Generate a temporary user ID
            const tempUserId = 'temp_' + Date.now();
            
            // Store temporary user_id in localStorage
            localStorage.setItem('user_id', tempUserId);
            localStorage.setItem('testRound', 'pre');

            console.log('Temporary User ID and testRound stored in localStorage:', {
                user_id: tempUserId,
                testRound: 'pre'
            });

            // Redirect to the demographics page
            window.location.href = 'pages/demographics.html';
        });
    });
});


// Function to display user information
function displayUserInfo(screenWidth, screenHeight, windowWidth, windowHeight, deviceType, browserName) {
    var userInfoText;
    var consentButton = document.getElementById('consentButton');
    var userInfoElement = document.getElementById('userInfo');

    // Calculate the dimensions if the device is rotated
    var rotatedWidth = Math.max(screenWidth, screenHeight);
    var rotatedHeight = Math.min(screenWidth, screenHeight);

    // Define the minimum width and height required for the experiment
    var minWidth = 800;
    var minHeight = 600;

    // Check if the screen size is too small in the current orientation
    if (screenWidth < minWidth || screenHeight < minHeight) {
        // Check if rotating the device would make it suitable
        if ((deviceType === 'tablet' || deviceType === 'iPad' || deviceType === 'mobile') && rotatedWidth >= minWidth && rotatedHeight >= minHeight) {
            userInfoText = `Your screen size of ${screenWidth}x${screenHeight}px is too small in the current orientation. Please rotate your device to landscape mode.`;
        } else {
            userInfoText = `Your screen size of ${screenWidth}x${screenHeight}px is too small for this experiment. Even if rotated, it may not meet the requirements. Please use a larger device if possible.`;
        }
        consentButton.disabled = true;
        userInfoElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    } else {
        userInfoText = `Your screen size of ${screenWidth}x${screenHeight}px is large enough for this experiment.`;
        consentButton.disabled = false;
        userInfoElement.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
    }

    document.getElementById('userInfoText').innerText = userInfoText;
    userInfoElement.style.display = 'block';
}

// Function to get browser name (placeholder, implement as needed)
function getBrowserName() {
    // Implement browser detection logic if needed
    return 'Unknown Browser';
}

// Function to check screen size and update user information
function checkScreenSize() {
    var screenWidth = window.screen.width;
    var screenHeight = window.screen.height;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var deviceType = 'tablet'; // Replace with actual device type detection logic if needed
    var browserName = getBrowserName();

    displayUserInfo(screenWidth, screenHeight, windowWidth, windowHeight, deviceType, browserName);
}

// Initial check
checkScreenSize();

// Add event listener to refresh on resize (e.g., device rotation)
window.addEventListener('resize', checkScreenSize);

// Function to get the browser name
function getBrowserName() {
    var userAgent = navigator.userAgent;
    var browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
        browserName = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
        browserName = "Firefox";
    } else if (userAgent.match(/safari/i)) {
        browserName = "Safari";
    } else if (userAgent.match(/opr\//i)) {
        browserName = "Opera";
    } else if (userAgent.match(/edg/i)) {
        browserName = "Edge";
    } else {
        browserName = "Unknown";
    }

    return browserName;
}
