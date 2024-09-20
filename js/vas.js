window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Local Storage Contents:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }

    const form = document.getElementById('vasForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const overlay = document.getElementById('explanationOverlay');
    const startButton = document.getElementById('startButton');
    let currentIndex = 0;

    const sound = new Audio('../media/ding.mp3'); // Adjust the path to your sound file
    const voice = new Audio('../speech/stressquestion.mp3'); // Adjust the path to your voice file

    startButton.addEventListener('click', function() {
        overlay.style.display = 'none';
        voice.play();
        document.querySelector('.slider-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    const sliderLabels = [
        { id: 'tense', text: 'I am tense' },
        { id: 'worried', text: 'I am worried' },
        { id: 'nervous', text: 'I feel nervous' },
        { id: 'jittery', text: 'I am jittery' },
        { id: 'indecisive', text: 'I feel indecisive' },
        { id: 'misfortune', text: 'I am worried about possible misfortunes' }
    ];

    sliderLabels.forEach(label => {
        const container = document.createElement('div');
        container.classList.add('slider-container');

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', label.id);
        labelElement.textContent = label.text;

        const slider = document.createElement('input');
        slider.setAttribute('type', 'range');
        slider.setAttribute('id', label.id);
        slider.setAttribute('name', label.id);
        slider.setAttribute('min', '1');
        slider.setAttribute('max', '100');
        slider.setAttribute('value', '50');
        slider.classList.add('slider');

        const labelContainer = document.createElement('div');
        labelContainer.classList.add('label', 'stress-scale');

        const notAtAll = document.createElement('span');
        notAtAll.textContent = 'Not at all';

        const aBit = document.createElement('span');
        aBit.textContent = 'A Bit';

        const extremely = document.createElement('span');
        extremely.textContent = 'Extremely';

        labelContainer.appendChild(notAtAll);
        labelContainer.appendChild(aBit);
        labelContainer.appendChild(extremely);

        container.appendChild(labelElement);
        container.appendChild(slider);
        container.appendChild(labelContainer);

        form.insertBefore(container, form.querySelector('.navigation-buttons'));
    });

    const sliders = document.querySelectorAll('.slider');

    sliders.forEach((slider, index) => {
        slider.addEventListener('mouseup', function() {
            console.log(`Slider mouseup event: ${slider.id}, value: ${slider.value}`);
            currentIndex = index;
            markAsAnswered(slider);
            moveToNextQuestion();
        });

        slider.addEventListener('keyup', function(event) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                console.log(`Slider keyup event: ${slider.id}, value: ${slider.value}`);
                currentIndex = index;
                markAsAnswered(slider);
                moveToNextQuestion();
            }
        });
    });

    function markAsAnswered(slider) {
        const container = slider.closest('.slider-container');
        container.classList.add('answered');
        sound.play();
    }

    function moveToNextQuestion() {
        console.log('Moving to next question. Current index:', currentIndex);
        currentIndex++;
        if (currentIndex < sliders.length) {
            const nextContainer = document.querySelector(`.slider-container:nth-child(${currentIndex + 1})`);
            if (nextContainer) {
                nextContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                nextContainer.classList.add('active');
            }
        } else {
            submitButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            submitButton.style.display = 'inline-block';
        }
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        submitForm();
    });

    function submitForm() {
        const user_id = localStorage.getItem('user_id');
        const testRound = localStorage.getItem('testRound'); // 'pre' or 'post'
        const data = {
            [`${testRound}_tense`]: document.getElementById('tense').value,
            [`${testRound}_worried`]: document.getElementById('worried').value,
            [`${testRound}_nervous`]: document.getElementById('nervous').value,
            [`${testRound}_jittery`]: document.getElementById('jittery').value,
            [`${testRound}_indecisive`]: document.getElementById('indecisive').value,
            [`${testRound}_misfortune`]: document.getElementById('misfortune').value,
        };

        // Store each value in localStorage with the testRound prefix
        for (const [key, value] of Object.entries(data)) {
            localStorage.setItem(key , value);
        }

        // Prepare the batch data to send in one request
        const fieldsData = Object.assign({}, data);
        const params = new URLSearchParams({
            userID: user_id,
            fieldsData: JSON.stringify(fieldsData)
        });

        // Send the batched update
        fetch('./forms/update_formbatch.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Batch update successful:', data);
                // Redirect to the next page or show a success message
                window.location.href = 'trail_making_test_b.html'; // Redirect to the appropriate next page
            } else {
                console.error('Error updating forms:', data);
                alert('Error updating forms: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating database:', error);
            alert('Error updating database: ' + error.message);
        });
    }
});
