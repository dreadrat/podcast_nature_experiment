(function() {
    function handleSliderBehavior(slider, markAsAnswered, moveToNextQuestion) {
        let isMouseDown = false;

        slider.addEventListener('mousedown', function() {
            isMouseDown = true;
        });

        slider.addEventListener('mouseup', function() {
            isMouseDown = false;
            markAsAnswered(slider);
            moveToNextQuestion();
        });

        slider.addEventListener('mousemove', function() {
            if (isMouseDown) {
                console.log(`Slider mousemove event: ${slider.id}, value: ${slider.value}`);
                // Optionally update UI during drag if needed
            }
        });

        slider.addEventListener('keyup', function(event) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                markAsAnswered(slider);
                moveToNextQuestion();
            }
        });
    }

    function markAsAnswered(slider) {
        const container = slider.closest('.slider-container');
        container.classList.add('answered');
    }

    function moveToNextQuestion(currentIndex, sliders, submitButton) {
        console.log('Moving to next question. Current index:', currentIndex);
        currentIndex++;
        if (currentIndex < sliders.length) {
            sliders[currentIndex].closest('.slider-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            submitButton.style.display = 'inline-block';
        }
        return currentIndex;
    }

    function initializeSliders(sliders, submitButton) {
        let currentIndex = 0;

        sliders.forEach((slider, index) => {
            handleSliderBehavior(slider, markAsAnswered, () => {
                currentIndex = moveToNextQuestion(currentIndex, sliders, submitButton);
            });
        });
    }

    function updateForm(userID, fieldName, fieldValue) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '../utsexperiment/forms/update_form.php', true);
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

    function initializePage(formId, startButtonId, overlayId, submitFormCallback) {
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        };

        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById(formId);
            const sliders = form.querySelectorAll('.slider');
            const submitButton = form.querySelector('button[type="submit"]');
            const startButton = document.getElementById(startButtonId);
            const overlay = document.getElementById(overlayId);
            
            // Log local storage contents
            console.log('Local Storage Contents:');
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                console.log(`${key}: ${value}`);
            }

            initializeSliders(sliders, submitButton);

            startButton.addEventListener('click', function() {
                overlay.style.display = 'none'; // Hide the overlay
            });

            form.addEventListener('submit', function(event) {
                event.preventDefault();
                submitFormCallback(sliders, submitButton);
            });
        });
    }

    // Expose the functions to the global scope
    window.sliderUtils = {
        handleSliderBehavior,
        markAsAnswered,
        moveToNextQuestion,
        initializeSliders,
        updateForm,
        initializePage
    };
})();
