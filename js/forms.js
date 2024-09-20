// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Local Storage Contents:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }

    // Show text field for other gender
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (document.getElementById('other').checked) {
                document.getElementById('otherGenderDiv').style.display = 'block';
            } else {
                document.getElementById('otherGenderDiv').style.display = 'none';
                document.getElementById('otherGender').value = '';
            }
        });
    });

    // Autocomplete for country field
    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia",
        "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
        "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
        "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
        "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
        "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini",
        "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
        "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia",
        "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
        "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
        "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
        "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
        "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
        "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
        "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
        "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
        "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
        "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden",
        "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
        "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
        "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
        "Yemen", "Zambia", "Zimbabwe"
    ];

    const countryInput = document.getElementById('country');
    const countryContainer = document.querySelector('.countryContainer');
    const autocompleteList = document.createElement('div');
    autocompleteList.setAttribute('id', 'autocomplete-list');
    autocompleteList.classList.add('autocomplete-suggestions');
    countryContainer.appendChild(autocompleteList);

    countryInput.addEventListener('input', function() {
        const value = countryInput.value.toLowerCase();
        autocompleteList.innerHTML = '';
        if (value) {
            const rect = countryInput.getBoundingClientRect();
            autocompleteList.style.top = `100px`;
            autocompleteList.style.left = '0px';
            autocompleteList.style.width = `${countryInput.offsetWidth}px`;

            countries.filter(country => country.toLowerCase().startsWith(value)).forEach(country => {
                const suggestion = document.createElement('div');
                suggestion.classList.add('autocomplete-suggestion');
                suggestion.textContent = country;
                suggestion.addEventListener('click', function() {
                    countryInput.value = country;
                    autocompleteList.innerHTML = '';
                });
                autocompleteList.appendChild(suggestion);
            });
        }
    });

    document.addEventListener('click', function(e) {
        if (!autocompleteList.contains(e.target) && e.target !== countryInput) {
            autocompleteList.innerHTML = '';
        }
    });
});


// Event listener for audio check
document.getElementById('headphones').addEventListener('change', function() {
    var headphones = this.value;
    var audioCheck = document.getElementById('audioCheck');
    var audioMessage = document.getElementById('audioMessage');
    var testSound = document.getElementById('testSound');

    if (headphones === 'yes') {
        audioMessage.textContent = 'Please ensure no other sound is playing and it is at a comfortable and audible volume.';
    } else if (headphones === 'no') {
        audioMessage.textContent = 'Please ensure you have speakers set up at a comfortable and audible volume.';
    } else {
        audioCheck.style.display = 'none';
        return;
    }

    audioCheck.style.display = 'block';
    testSound.play().catch(function(error) {
        console.error('Error playing sound:', error);
    });
});

document.getElementById('testSound').addEventListener('ended', function() {
    document.getElementById('playSoundAgainButton').style.display = 'block';
});

document.getElementById('playSoundAgainButton').addEventListener('click', function() {
    var testSound = document.getElementById('testSound');
    testSound.play().catch(function(error) {
        console.error('Error playing sound:', error);
    });
});



// Event listener for form submission
document.getElementById('demographicForm').addEventListener('submit', function(event) {
    console.log('Form submission started.');
    
    // Prevent the form from submitting normally
    event.preventDefault();
    console.log('Form submission prevented.');

    // Retrieve form values and user_id from local storage
    const user_id = localStorage.getItem('user_id');
    const age = document.getElementById('age').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const country = document.getElementById('country').value;
    const headphones = document.getElementById('headphones').value;
    const audioConfirmation = document.querySelector('input[name="audioConfirmation"]:checked');
    const podcastFrequency = document.querySelector('input[name="podcastFrequency"]:checked');
    const preferredGenre = document.querySelector('input[name="preferredgenre"]:checked');

    console.log('Retrieved form values:', {
        user_id,
        age,
        gender: gender ? gender.value : null,
        country,
        headphones,
        audioConfirmation: audioConfirmation ? audioConfirmation.value : null,
        podcastFrequency: podcastFrequency ? podcastFrequency.value : null,
        preferredGenre: preferredGenre ? preferredGenre.value : null
    });

    // Clear any previous errors
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function(message) {
        message.remove();
    });
    const invalidInputs = document.querySelectorAll('.invalid');
    invalidInputs.forEach(function(input) {
        input.classList.remove('invalid');
    });
    console.log('Cleared previous errors.');

    // Validation flags
    let isValid = true;

    // Function to add error message and highlight invalid input
    function addErrorMessage(input, message) {
        isValid = false;
        input.classList.add('invalid');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        input.parentElement.appendChild(errorMessage);
        if (isValid) {
            input.focus();
        }
        console.log('Validation error:', message);
    }

    // Validation Checks
    if (!age || isNaN(age) || age < 18) {
        addErrorMessage(document.getElementById('age'), 'You must be at least 18 years old to participate.');
    }
    if (!gender) {
        addErrorMessage(document.querySelector('input[name="gender"]'), 'Please select your gender.');
    }
    if (!country) {
        addErrorMessage(document.getElementById('country'), 'Please enter your country.');
    }
    if (!headphones) {
        addErrorMessage(document.getElementById('headphones'), 'Please indicate whether you are using headphones.');
    }
    if (!audioConfirmation || audioConfirmation.value !== 'yes') {
        addErrorMessage(document.querySelector('input[name="audioConfirmation"]'), 'Please confirm that you heard the test sound.');
    }
    if (!podcastFrequency) {
        addErrorMessage(document.querySelector('input[name="podcastFrequency"]'), 'Please select how frequently you listen to podcasts.');
    }
    if (!preferredGenre) {
        addErrorMessage(document.querySelector('input[name="preferredgenre"]'), 'Please select your preferred podcast genre.');
    }

    // If the form is not valid, prevent submission
    if (!isValid) {
        const firstInvalidInput = document.querySelector('.invalid');
        if (firstInvalidInput) {
            firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        console.log('Form is not valid, submission halted.');
        return;
    }
    console.log('Form is valid, proceeding with submission.');

    // If the form is valid, proceed with AJAX submission
    const preferredGenreValue = preferredGenre.value;

    // Save preferred genre to local storage
    localStorage.setItem('preferredgenre', preferredGenreValue);
    console.log('Preferred genre saved to local storage:', preferredGenreValue);

    // Prepare data for batch update
    const fieldsData = {
        'age': age,
        'gender': gender.value,
        'country': country,
        'headphones': headphones,
        'podcastfrequency': podcastFrequency.value,
        'preferredgenre': preferredGenreValue
    };
    console.log('Prepared fields data for batch update:', fieldsData);

    // AJAX call to update_formbatch.php
    console.log('Sending AJAX request to update_formbatch.php...');
    fetch('./update_formbatch.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'userID': user_id,
            'fieldsData': JSON.stringify(fieldsData)
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Received response from update_formbatch.php:', data);
        if (data.status === 'success') {
            console.log('Database update successful. Redirecting to the stressor explainer page.');
            // Redirect to the stressor explainer page
            window.location.href = 'pages/stressor_task.html';
        } else {
            // Handle any errors that occurred during the update
            console.error('Error updating database:', data.message);
            alert('Error updating database: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating database:', error);
        alert('Error updating database: ' + error.message);
    });
});



