(function() {
    const { initializePage, updateForm } = window.sliderUtils;
    function submitForm(sliders, submitButton) {
        const user_id = localStorage.getItem('user_id');
        const data = {};
    
        sliders.forEach((slider, index) => {
            const fieldName = `prs${index + 1}`;
            data[fieldName] = slider.value;
            localStorage.setItem(fieldName, slider.value);
        });
    
        // Prepare data for batch update
        const fieldsData = JSON.stringify(data);
    
        // AJAX call to batch update function
        fetch('./forms/update_formbatch.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'userID': user_id,
                'fieldsData': fieldsData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('All forms updated successfully:', data);
                // Redirect to the next page or show a success message
                window.location.href = 'personal_results.html'; // Replace with the actual next page
            } else {
                console.error('Error updating some forms:', data.message);
                alert('Error updating some forms: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error updating database:', error);
            alert('Error updating database: ' + error.message);
        });
    }

    // Add event listener for the start button
    document.getElementById('startButton').addEventListener('click', function() {
        const audio = document.getElementById('audio');
        audio.play().catch(function(error) {
            console.error('Error playing audio:', error);
        });
    });

    initializePage('prsForm', 'startButton', 'explanationOverlay', submitForm);
})();