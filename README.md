# Podcast Nature Experiment

## Project Description

The Podcast Nature Experiment is designed to measure stress and cognitive function after exposure to various stimuli. Participants will interact with different tasks and surveys, and their responses will be recorded and analyzed to understand the effects of the stimuli.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

### Prerequisites

- A web server with PHP support
- REDCap API access
- Your own stimuli videos

### Steps

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/podcast-nature-experiment.git
    cd podcast-nature-experiment
    ```

2. **Set up your REDCap API key:**
    - Open the following PHP files and replace the placeholder API tokens with your own:
    - - `forms/update_form.php`
        - `forms/update_formbatch.php`
        - `forms/get_personal_results.php`
    - Example:
        ```php
        define('REDCAP_API_TOKEN', 'your_token_here');
        ```

3. **Add your stimuli videos:**
    - Place your stimuli videos in the `media` directory.
    - Update filenames and conditions in 'js/naturewalk.js'


## Usage

1. **Access the experiment:**
    - Open your web browser and navigate to the project URL (e.g., `http://localhost/podcast-nature-experiment`).

2. **Participate in the experiment:**
    - Follow the on-screen instructions to complete the tasks and surveys.

3. **View results:**
    - Results will be stored in your REDCap project and can be accessed via the provided PHP scripts.

## File Structure
