document.addEventListener('DOMContentLoaded', function () {



    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
    const apiUrl = `forms/get_general_results.php`;

    console.log('Base Path:', basePath);
    console.log('API URL:', apiUrl);

    console.log('Local Storage Contents:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }

    fetch(apiUrl)
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            if (data.success) {
                displayResults(data);
            } else {
                console.error('Error:', data.error);
                alert('Request failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Request failed. Please try again.');
        });
});

function displayResults(data) {
    console.log('Displaying results:', data);

    const stressStats = data.stress_stats;
    const trailStats = data.trail_stats;
    const prsStats = data.prs_stats;

    console.log('Stress Stats:', stressStats);
    console.log('Trail Stats:', trailStats);
    console.log('PRS Stats:', prsStats);

    const stressStatsContainer = document.getElementById('stress-stats');
    const trailStatsContainer = document.getElementById('trail-stats');
    const prsStatsContainer = document.getElementById('prs-stats');

    stressStatsContainer.innerHTML = createStatsTable(stressStats);
    trailStatsContainer.innerHTML = createStatsTable(trailStats);
    prsStatsContainer.innerHTML = createStatsTable(prsStats);
}

function createStatsTable(stats) {
    console.log('Creating stats table for:', stats);

    const rows = Object.keys(stats).map(key => {
        return `<tr>
            <td>${key.replace(/_/g, ' ')}</td>
            <td>${parseFloat(stats[key]).toFixed(2)}</td>
        </tr>`;
    }).join('');

    return `<table>
        <thead>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>`;
}
