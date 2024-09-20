document.addEventListener('DOMContentLoaded', function() {
    console.log('Local Storage Contents:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }

    const startButton = document.getElementById('startButton');
    startButton.disabled = true; // Disable the start button initially

    const overlay = document.getElementById('overlay');
    const video = document.getElementById('natureVideo');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingProgress = document.getElementById('loadingProgress');
    
    video.controls = false;
    video.preload = 'auto';

    const conditionTitle = document.getElementById('conditionTitle');
    const conditions = ['urban', 'nature_congruent','nature_congruent', 'nature_congruent',  'nature_podcast', 'ai_generated'];
    const conditionNames = {
        urban: 'Urban Video and Sounds',
        nature_congruent: 'Nature Video and Congruent Sounds',
        nature_podcast: 'Nature Video and Podcast',
        ai_generated: 'AI Generated Nature Video'
    };
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
    const explainer = document.querySelector('.explainer');

    // Save the assigned condition name to local storage
    localStorage.setItem('assigned_condition', conditionNames[condition]);

    // Save the assigned condition to the database
       const user_id = localStorage.getItem('user_id');
       updateForm(user_id, 'assigned_condition', conditionNames[condition])
           .then(response => console.log('Condition saved to REDCap:', response))
           .catch(error => console.error('Error saving condition to REDCap:', error));

    // Set the condition title
    conditionTitle.innerHTML = `<div>You have been selected for the ${conditionNames[condition]} condition</div><button id="conditioncontinue" class="start-button">Continue</button>`;

    // Now that the button exists in the DOM, get the newly added "Continue" button
    const continueButton = document.getElementById('conditioncontinue');
    // Get the audio element
    const instructionsAudio = document.getElementById('Instructions');

    let lastBufferedTime = 0;
    let lastCheckTime = Date.now();
    let checkBufferInterval;
    let bufferSpeed = 0;

    // Add event listener to hide the conditionTitle div when "Continue" is clicked
    continueButton.addEventListener('click', function() {
        conditionTitle.style.display = 'none';
        loadingOverlay.style.display = 'block'; // Show loading overlay

        // Set video source and start loading
        switch (condition) {
            case 'urban':
                video.innerHTML = `
                    <source src="${basePath}/media/urban_video.mp4" type="video/mp4; codecs=hev1">
                    <source src="${basePath}/media/urban_video_h264.mp4" type="video/mp4">
                `;
                break;
            case 'nature_congruent':
                video.innerHTML = `
                    <source src="${basePath}/media/nature_walk.mp4" type="video/mp4; codecs=hev1">
                    <source src="${basePath}/media/nature_walk_h264.mp4" type="video/mp4">
                `;
                break;
            case 'nature_podcast':
                const preferredGenre = localStorage.getItem('preferredgenre');
                video.innerHTML = `
                    <source src="${basePath}/media/nature_podcast_${preferredGenre}.mp4" type="video/mp4; codecs=hev1">
                    <source src="${basePath}/media/nature_podcast_${preferredGenre}_h264.mp4" type="video/mp4">
                `;
                break;
            case 'ai_generated':
                video.innerHTML = `
                    <source src="${basePath}/media/ai_final.mp4" type="video/webm">
                    <source src="${basePath}/media/ai_final_h264.mp4" type="video/mp4">
                `;
                break;
        }

        video.load(); // Start loading the video
        video.pause(); // Immediately pause it

        // Play the audio instructions
        instructionsAudio.play();

        // Start checking the buffer progress
        checkBufferInterval = setInterval(checkBuffering, 5000); // Check every 5 seconds
    });

    // Track buffering progress
    video.addEventListener('progress', function() {
        if (video.buffered.length > 0) {
            let bufferedTime = 0;
            for (let i = 0; i < video.buffered.length; i++) {
                bufferedTime += video.buffered.end(i) - video.buffered.start(i);
            }
            const duration = video.duration;
            if (duration > 0) {
                const progress = Math.min(100, (bufferedTime / duration) * 100);
                loadingProgress.style.width = `${progress}%`;
                console.log(`Buffering progress: ${progress}%`);

                const currentTime = Date.now();
                bufferSpeed = (bufferedTime - lastBufferedTime) / ((currentTime - lastCheckTime) / 1000);
                lastBufferedTime = bufferedTime; // Update the last buffered time
                lastCheckTime = currentTime; // Update the last check time

                // Adjust buffer threshold dynamically based on buffering speed
                let bufferThreshold = Math.max(0.3, 0.9 - bufferSpeed / 10); // Adjust the threshold based on speed

                // Check if buffered time is enough to safely start playback
                if (bufferedTime / duration >= bufferThreshold) { // Dynamic threshold
                    loadingOverlay.innerHTML = '<p>Video sufficiently buffered. Ready to play.</p>';
                    startButton.disabled = false; // Enable the start button
                    clearInterval(checkBufferInterval); // Stop checking for buffering
                }
            }
        }
    });

    // Buffer check logic
    function checkBuffering() {
        if (video.buffered.length > 0) {
            let bufferedTime = video.buffered.end(video.buffered.length - 1);

            if (bufferedTime <= lastBufferedTime) {
                // If buffering hasn't progressed, nudge the video by seeking a tiny bit forward
                video.currentTime = bufferedTime + 0.1;
                console.log('Buffering stalled. Nudging forward to encourage more buffering.');
            } else {
                lastBufferedTime = bufferedTime; // Update the last buffered time
            }
        }
    }

    // Ensure startButton is still disabled if clicked before audio ends
    startButton.addEventListener('click', function(event) {
        if (startButton.disabled) {
            event.preventDefault();
            return;
        }

        explainer.style.display = 'none';
        video.currentTime = 0;  // Reset video to the start
        video.requestFullscreen()
        .then(() => {
            video.style.display = 'block';
            video.play();
            startButton.style.display = 'none';
            overlay.style.display = 'none'; // Hide overlay initially
            disableInput();
            logTimeRemaining();
        })
        .catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message}`));
    });

    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement) {
            overlay.style.display = 'flex';
            overlay.innerHTML = `
                <p>You exited fullscreen mode. Please click below to return to fullscreen.</p>
                <button id="returnButton" class="start-button">Back to Fullscreen</button>
            `;
            document.getElementById('returnButton').addEventListener('click', function() {
                video.requestFullscreen()
                    .then(() => {
                        overlay.style.display = 'none';
                        disableInput();
                    })
                    .catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message}`));
            });
        }
    });

    // Disable all keyboard and mouse inputs except for the Escape key
    function disableInput() {
        function preventDefaultForOtherKeys(e) {
            if (e.key !== 'Escape') {
                e.preventDefault();
            }
        }

        function preventMouseActions(e) {
            e.preventDefault();
        }

        document.addEventListener('keydown', preventDefaultForOtherKeys);
        document.addEventListener('mousemove', preventMouseActions);
        document.addEventListener('mousedown', preventMouseActions);
        document.addEventListener('mouseup', preventMouseActions);
        document.addEventListener('wheel', preventMouseActions);
        document.addEventListener('contextmenu', preventMouseActions);

        // Allow exiting fullscreen and re-enabling inputs on Escape key press
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', preventDefaultForOtherKeys);
                document.removeEventListener('mousemove', preventMouseActions);
                document.removeEventListener('mousedown', preventMouseActions);
                document.removeEventListener('mouseup', preventMouseActions);
                document.removeEventListener('wheel', preventMouseActions);
                document.removeEventListener('contextmenu', preventMouseActions);

                // Show overlay and enable "Back to fullscreen" button
                overlay.style.display = 'flex';
                overlay.innerHTML = `
                    <p>You exited fullscreen mode. Please click below to return to fullscreen.</p>
                    <button id="returnButton" class="start-button">Back to Fullscreen</button>
                `;
                document.getElementById('returnButton').addEventListener('click', function() {
                    video.requestFullscreen()
                        .then(() => {
                            overlay.style.display = 'none';
                            disableInput();
                        })
                        .catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message}`));
                });
            }
        });
    }

    // Log remaining time in console every second
    function logTimeRemaining() {
        const duration = video.duration;
        const interval = setInterval(() => {
            const timeLeft = duration - video.currentTime;
            console.log(`Time remaining: ${Math.ceil(timeLeft)} seconds`);
            if (timeLeft <= 0) {
                clearInterval(interval);
                localStorage.setItem('testRound', 'post'); // Update localStorage to 'post'
                window.location.href = `${basePath}/pages/stress_vas.html`; // Redirect to the next part of the study
            }
        }, 1000);
    }

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
});
