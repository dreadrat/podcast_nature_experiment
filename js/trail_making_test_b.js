document.addEventListener('DOMContentLoaded', function() {

    console.log('Local Storage Contents:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }




    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const instructionsOverlay = document.getElementById('instructions-overlay');
    const examplePoints = [
        { x: 50, y: 50, value: '1' }, { x: 400, y: 200, value: 'A' }, 
        { x: 150, y: 50, value: '2' }, { x: 550, y: 250, value: 'B' }, 
        { x: 200, y: 350, value: '3' }, { x: 650, y: 100, value: 'C' }
    ];

    const startButton = document.getElementById('startButton');
    const submitButton = document.getElementById('submitButton');
    const overlay = document.getElementById('overlay');
    const completionMessage = document.getElementById('completionMessage');
    const continueButton = document.getElementById('continueButton');
    const user_id = localStorage.getItem('user_id');
    const testRound = localStorage.getItem('testRound'); // 'pre' or 'post'
    console.log('Current Test Round:', testRound);

    let points = [];
    let sequence = [];
    let startTime;
    let endTime;
    let isDrawing = false;
    let lastClickedPoint = null;
    let errors = 0;
    let trails = [];
    let animationRunning = true;

    
    // Get the button and audio element
    const readItButton = document.querySelector('.readit');
    const instructionsAudio = document.getElementById('instructionsAudio');

    // Add event listener to the button
    readItButton.addEventListener('click', function() {
        // Play the audio when the button is clicked
        instructionsAudio.play();
    });


    // Draw the example points and lines
    function drawExample() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = '#4CAF50'; // Use the same color for the trail

        // Draw points
        for (let i = 0; i < examplePoints.length; i++) {
            drawPoint(examplePoints[i], '#d3d3d3'); // Initially all points are light grey
        }
    }

    // Animate the example drawing
    function animateExample() {
        let index = 0;

        function animate() {
            if (!animationRunning) return; // Stop animation if flag is false

            if (index < examplePoints.length) {
                drawExample();

                context.strokeStyle = '#4CAF50'; // Use the same color for the trail
                context.lineWidth = 3;

                // Draw trail up to the current point
                context.beginPath();
                context.moveTo(examplePoints[0].x, examplePoints[0].y);
                for (let i = 1; i <= index; i++) {
                    context.lineTo(examplePoints[i].x, examplePoints[i].y);
                }
                context.stroke();

                // Turn the points green up to the current point
                for (let i = 0; i <= index; i++) {
                    drawPoint(examplePoints[i], '#4CAF50');
                }

                index++;
                setTimeout(animate, 1000); // Adjust the speed as needed
            } else {
                setTimeout(animateExample, 1000); // Restart the animation after a delay
            }
        }

        animate();
    }

    function drawPoint(point, color) {
        context.beginPath();
        context.arc(point.x, point.y, 20, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
        context.strokeStyle = '#000000'; // Ensure circle border is black
        context.stroke();
        context.fillStyle = '#000';
        context.font = '20px Arial'; // Ensure the font size and style match
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(point.value, point.x, point.y);
    }

    const pattern1 = [
        {"type":"number","value":1,"x":100,"y":150},
        {"type":"number","value":2,"x":200,"y":250},
        {"type":"number","value":3,"x":300,"y":350},
        {"type":"number","value":4,"x":400,"y":450},
        {"type":"number","value":5,"x":500,"y":550},
        {"type":"number","value":6,"x":600,"y":150},
        {"type":"number","value":7,"x":700,"y":250},
        {"type":"number","value":8,"x":150,"y":350},
        {"type":"number","value":9,"x":250,"y":450},
        {"type":"number","value":10,"x":350,"y":550},
        {"type":"number","value":11,"x":450,"y":150},
        {"type":"number","value":12,"x":550,"y":250},
        {"type":"number","value":13,"x":650,"y":350},
        {"type":"letter","value":"A","x":750,"y":450},
        {"type":"letter","value":"B","x":100,"y":550},
        {"type":"letter","value":"C","x":200,"y":150},
        {"type":"letter","value":"D","x":300,"y":250},
        {"type":"letter","value":"E","x":400,"y":350},
        {"type":"letter","value":"F","x":500,"y":450},
        {"type":"letter","value":"G","x":600,"y":550},
        {"type":"letter","value":"H","x":700,"y":150},
        {"type":"letter","value":"I","x":150,"y":250},
        {"type":"letter","value":"J","x":250,"y":350},
        {"type":"letter","value":"K","x":350,"y":450},
        {"type":"letter","value":"L","x":450,"y":550}
    ];

    const pattern2 = [
        {"type":"number","value":1,"x":120,"y":160},
    {"type":"number","value":2,"x":220,"y":260},
    {"type":"number","value":3,"x":320,"y":360},
    {"type":"number","value":4,"x":420,"y":460},
    {"type":"number","value":5,"x":520,"y":560},
    {"type":"number","value":6,"x":620,"y":160},
    {"type":"number","value":7,"x":720,"y":260},
    {"type":"number","value":8,"x":170,"y":360},
    {"type":"number","value":9,"x":270,"y":460},
    {"type":"number","value":10,"x":370,"y":560},
    {"type":"number","value":11,"x":470,"y":160},
    {"type":"number","value":12,"x":570,"y":260},
    {"type":"number","value":13,"x":670,"y":360},
    {"type":"letter","value":"A","x":770,"y":460},
    {"type":"letter","value":"B","x":120,"y":560},
    {"type":"letter","value":"C","x":220,"y":160},
    {"type":"letter","value":"D","x":320,"y":260},
    {"type":"letter","value":"E","x":420,"y":360},
    {"type":"letter","value":"F","x":520,"y":460},
    {"type":"letter","value":"G","x":620,"y":560},
    {"type":"letter","value":"H","x":720,"y":160},
    {"type":"letter","value":"I","x":170,"y":260},
    {"type":"letter","value":"J","x":270,"y":360},
    {"type":"letter","value":"K","x":370,"y":460},
    {"type":"letter","value":"L","x":470,"y":560}
    ];

    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
    
    function playCorrectSound() {
        const correctSound = new Audio(`${basePath}/media/correct.mp3`);
        correctSound.play();
    }

    function playErrorSound() {
        const errorSound = new Audio(`${basePath}/media/error.mp3`);
        errorSound.play();
    }

    function initPoints() {
        points = testRound === 'pre' ? pattern1 : pattern2;
        points.forEach(point => point.clicked = false); // Initialize clicked flag
        sequence = generateSequence();
        trails = [];
        drawScene();
    }

    function generateSequence() {
        let sequence = [];
        for (let i = 1; i <= 13; i++) {
            sequence.push(i.toString());
            if (i <= 12) { // Ensure we only add letters up to 'L'
                sequence.push(String.fromCharCode(64 + i));
            }
        }
        return sequence;
    }

    function drawScene() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawTrails();
        drawPoints();
    }

    function drawPoints() {
        context.font = '20px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        for (let i = 0; i < points.length; i++) {
            drawPoint(points[i], points[i].color || '#d3d3d3'); // Light grey color for unclicked points
        }
    }

    function drawPoint(point, color) {
        context.beginPath();
        context.arc(point.x, point.y, 20, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
        context.strokeStyle = '#000000'; // Ensure circle border is black
        context.stroke();
        context.fillStyle = '#000';
        context.font = '20px Arial'; // Ensure the font size and style match
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(point.value, point.x, point.y);
    }

    function drawTrails() {
        context.strokeStyle = '#4CAF50'; // Green color for the trail
        context.lineWidth = 3;
        for (let i = 0; i < trails.length - 1; i += 2) {
            context.beginPath();
            context.moveTo(trails[i].x, trails[i].y);
            context.lineTo(trails[i + 1].x, trails[i + 1].y);
            context.stroke();
        }
    }

    function startDrawing() {
        isDrawing = true;
        startTime = new Date();
        canvas.addEventListener('click', handleCanvasClick);
    }

    function stopDrawing() {
        isDrawing = false;
        endTime = new Date();
        canvas.removeEventListener('click', handleCanvasClick);
        submitResults();
    }

    function handleCanvasClick(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        const radius = 20;
    
        const point = points.find(p => {
            const dx = p.x - x;
            const dy = p.y - y;
            return dx * dx + dy * dy <= radius * radius;
        });
    
        if (point && !point.clicked) {
            console.log("Clicked point:", point.value);
            console.log("Expected point:", sequence[0]);
            if (point.value.toString() === sequence[0]) {
                playCorrectSound();
                point.color = '#4CAF50'; // Change color to green
                point.clicked = true; // Mark point as clicked
                sequence.shift();
                console.log("Remaining sequence:", sequence);
                if (lastClickedPoint) {
                    trails.push(lastClickedPoint);
                    trails.push(point);
                }
                lastClickedPoint = point;
    
                if (sequence.length === 0) {
                    console.log("Sequence completed.");
                    stopDrawing();
                }
                drawScene();
            } else {
                playErrorSound();
                errors++;
                point.color = '#ff0000'; // Change color to red for 0.5 seconds
                drawScene();
                setTimeout(() => {
                    point.color = '#d3d3d3'; // Change back to light grey
                    drawScene();
                }, 500);
            }
        }
    }
    
    function submitResults() {
        const duration = (endTime - startTime) / 1000; // duration in seconds
        const durationField = `${testRound}_test_duration`;
        const errorsField = `${testRound}_test_errors`;

        
    // Store duration and errors in local storage
    localStorage.setItem(durationField, duration);
    localStorage.setItem(errorsField, errors);

        Promise.all([
            updateForm(user_id, durationField, duration),
            updateForm(user_id, errorsField, errors)
        ])
        .then(results => {
            // Check if all updates succeeded
            if (results.every(result => result.status === 'success')) {
                console.log('All forms updated successfully:', results);
                showCompletionMessage(duration, errors);
            } else {
                console.error('Error updating some forms:', results);
                alert('Error updating some forms.');
            }
        })
        .catch(error => {
            console.error('Error updating database:', error);
            alert('Error updating database: ' + error.message);
        });
    }
    
    function showCompletionMessage(duration, errors) {
        completionMessage.textContent = `You finished in ${duration.toFixed(2)} seconds with ${errors} errors.`;
        overlay.style.display = 'block';
    }
    
    startButton.addEventListener('click', function() {
        // Request fullscreen for the entire document
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }

        // Stop animation and hide instructions
        animationRunning = false;
        instructionsOverlay.style.display = 'none';

        initPoints();
        startButton.style.display = 'none';
        startDrawing();
    });
    
    continueButton.addEventListener('click', function() {
        if (testRound === 'pre') {
            window.location.href = 'naturewalk.html'; // Redirect to the next part of the study
        } else {
            window.location.href = 'perceived_restorativeness_scale.html'; // Redirect to the Perceived Restorativeness Scale page
        }
    });

    function showCompletionMessage(duration, errors) {
        completionMessage.textContent = `You finished in ${duration.toFixed(2)} seconds with ${errors} errors.`;
        overlay.style.display = 'block';
    }

    startButton.addEventListener('click', function() {
          // Hide instructions
        instructionsOverlay.style.display = 'none';
        initPoints();
        startButton.style.display = 'none';
        startDrawing();
    });

    continueButton.addEventListener('click', function() {
        if (testRound === 'pre') {
            window.location.href = 'naturewalk.html'; // Redirect to the next part of the study
        } else {
            window.location.href = 'perceived_restorativeness_scale.html'; // Redirect to the Perceived Restorativeness Scale page
        }
    });

    // Ensure the animation runs on page load
    animateExample();
});

// Function to update form data
function updateForm(userID, fieldName, fieldValue) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', './forms/update_form.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.status === 'success') {
                            console.log('Form updated:', response);
                            resolve(response);
                        } else {
                            console.error('Error updating form:', response);
                            reject(response);
                        }
                    } catch (error) {
                        console.error('Error parsing response:', error);
                        reject({ status: 'error', message: 'Error parsing response' });
                    }
                } else {
                    console.error('HTTP error:', xhr.status, xhr.statusText);
                    reject({ status: 'error', message: 'HTTP error ' + xhr.status });
                }
            }
        };
        const params = `userID=${encodeURIComponent(userID)}&fieldName=${encodeURIComponent(fieldName)}&fieldValue=${encodeURIComponent(fieldValue)}`;
        xhr.send(params);
    });
}
