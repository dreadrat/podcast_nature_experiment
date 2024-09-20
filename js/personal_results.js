document.addEventListener('DOMContentLoaded', function () {
    console.log('Local Storage Contents:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }

      
    const userId = localStorage.getItem('user_id');
    const preStressTotal = getTotalStress('pre');
    const postStressTotal = getTotalStress('post');
    const testTimeDifference = getTimeDifference();
    const testErrorDifference = getErrorDifference();
    const prsTotals = getPRSTotals();
    const groupedScores = getGroupedScores(prsTotals);

     
// Check if user_id exists in localStorage
if (userId) {
    // Find the div with the class "completion-code"
    const completionCodeDiv = document.querySelector('.completion-code');

    // Check if recruitment_source exists in localStorage
    const recruitmentSource = localStorage.getItem('recruitment_source');
    
    // Determine the completion code based on recruitmentSource
    let completionCode = `Completion code: ${userId}`;
    
    // If recruitmentSource is set to 'silly-farm-duckling', change the completion code
    if (recruitmentSource === 'clickworker') {
        completionCode = `Completion code: hurtle-ranking-penguin-matron`;
    }  else if (recruitmentSource === 'clickworker3') {
        completionCode = `Completion code: hat-changing-monster-club`;
    }

    // Set the inner text of the div to display the completion code
    completionCodeDiv.innerText = completionCode;
} else {
    // Optionally, handle the case where user_id is not found
    console.error('User ID not found in localStorage.');
}

    displayResults({
        preStressTotal,
        postStressTotal,
        testTimeDifference,
        testErrorDifference,
        groupedScores
    });

    // Send the calculated totals to REDCap
   //   sendTotalsToRedcap({
   //      preStressTotal,
    //    postStressTotal,
    //     testTimeDifference,
    //     testErrorDifference,
     //    groupedScores
   // }, userId);
});

function getTotalStress(round) {
    const metrics = ['tense', 'worried', 'nervous', 'jittery', 'indecisive', 'misfortune'];
    let total = 0;
    metrics.forEach(metric => {
        total += parseInt(localStorage.getItem(`${round}_${metric}`), 10) || 0;
    });
    return total;
}

function getTimeDifference() {
    const preTime = parseFloat(localStorage.getItem('pre_test_duration')) || 0;
    const postTime = parseFloat(localStorage.getItem('post_test_duration')) || 0;
    return postTime - preTime;
}

function getErrorDifference() {
    const preErrors = parseInt(localStorage.getItem('pre_test_errors'), 10) || 0;
    const postErrors = parseInt(localStorage.getItem('post_test_errors'), 10) || 0;
    return postErrors - preErrors;
}

function getPRSTotals() {
    const prsItems = ['prs1', 'prs2', 'prs3', 'prs4', 'prs5', 'prs6', 'prs7', 'prs8', 'prs9', 'prs10', 'prs11'];
    let totals = {};
    prsItems.forEach(item => {
        totals[item] = parseInt(localStorage.getItem(item), 10) || 0;
    });
    return totals;
}

function getGroupedScores(totals) {
    const groups = {
        being_away: ['prs1', 'prs2'],
        fascination: ['prs3', 'prs4', 'prs5', 'prs6'],
        coherence: ['prs7', 'prs8'],
        scope: ['prs9', 'prs10', 'prs11']
    };
    const maxScores = {
        being_away: 14, // 2 items, each with a maximum score of 7
        fascination: 28, // 4 items, each with a maximum score of 7
        coherence: 14, // 2 items, each with a maximum score of 7
        scope: 21 // 3 items, each with a maximum score of 7
    };
    let groupedScores = {};
    for (let group in groups) {
        let totalScore = groups[group].reduce((sum, item) => sum + (totals[item] || 0), 0);
        groupedScores[group] = (totalScore / maxScores[group]) * 100; // Convert to percentage
    }
    return groupedScores;
}

function displayResults(calculatedTotals) {
    const { preStressTotal, postStressTotal, testTimeDifference, testErrorDifference, groupedScores } = calculatedTotals;

    const stressChange = ((postStressTotal - preStressTotal) / preStressTotal) * 100;
    const timeChange = testTimeDifference > 0 ? `${testTimeDifference.toFixed(2)} seconds slower` : `${Math.abs(testTimeDifference).toFixed(2)} seconds faster`;
    const errorChange = testErrorDifference > 0 ? `${testErrorDifference} more errors` : `${Math.abs(testErrorDifference)} fewer errors`;
    const condition = localStorage.getItem('assigned_condition') || 'the environment';

    const blurb = `
        After watching a 4 minute video of ${condition}, you:
        <ul>
        <li>recorded a ${Math.abs(stressChange).toFixed(2)}% ${stressChange > 0 ? 'increase' : 'decrease'} in self-reported stress</li>
        <li>completed the Trail Making Test (B) ${timeChange} with ${errorChange}</li>
        </ul>
        When asked how restorative you found the environment, you rated it as follows on the PRS11 scale:
    `;

    document.querySelector('.results-table').innerHTML = `<p>${blurb}</p>`;

    createPRSBarchart(groupedScores);
    createStressBarchart(preStressTotal, postStressTotal);
    createTrailMakingTestBarchart();
}

function createPRSBarchart(groupedScores) {
    const ctx = document.getElementById('prs11Chart').getContext('2d');
    const labels = ['Being Away', 'Fascination', 'Coherence', 'Scope'];
    const data = [
        groupedScores.being_away,
        groupedScores.fascination,
        groupedScores.coherence,
        groupedScores.scope
    ];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'PRS11 Scores (%)',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        display: false // Hide grid lines
                    }
                },
                x: {
                    grid: {
                        display: false // Hide grid lines
                    }
                }
            }
        }
    });
}

function createStressBarchart(preStressTotal, postStressTotal) {
    const ctx = document.getElementById('stressChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pre-Stress', 'Post-Stress'],
            datasets: [{
                label: 'Stress Scores',
                data: [preStressTotal, postStressTotal],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(preStressTotal, postStressTotal) + 10, // Add some padding to the top
                    ticks: {
                        stepSize: 15 // Set label intervals for time in 15-second increments
                    },
                    grid: {
                        display: false // Hide grid lines
                    }
                },
                x: {
                    grid: {
                        display: false // Hide grid lines
                    }
                }
            }
        }
    });
}

function createTrailMakingTestBarchart() {
    const ctx = document.getElementById('trailMakingTestChart').getContext('2d');
    const preTime = parseFloat(localStorage.getItem('pre_test_duration')) || 0;
    const postTime = parseFloat(localStorage.getItem('post_test_duration')) || 0;
    const preErrors = parseInt(localStorage.getItem('pre_test_errors'), 10) || 0;
    const postErrors = parseInt(localStorage.getItem('post_test_errors'), 10) || 0;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pre-Test', 'Post-Test'],
            datasets: [
                {
                    label: 'Time (seconds)',
                    data: [preTime, postTime],
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                    yAxisID: 'y-time'
                },
                {
                    label: 'Errors',
                    data: [preErrors, postErrors],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    yAxisID: 'y-errors'
                }
            ]
        },
        options: {
            scales: {
                'y-time': {
                    beginAtZero: true,
                    max: Math.max(preTime, postTime) + 10, // Add some padding to the top
                    ticks: {
                        stepSize: 15 // Set label intervals for time in 15-second increments
                    },
                    title: {
                        display: true,
                        text: 'Seconds'
                    },
                    grid: {
                        display: false // Hide grid lines
                    }
                },
                'y-errors': {
                    beginAtZero: true,
                    position: 'right',
                    max: Math.max(preErrors, postErrors) + 1, // Set minimum to max errors + 1
                    ticks: {
                        stepSize: 1, // Errors should be in full integers
                        precision: 0
                    },
                    title: {
                        display: true,
                        text: 'Errors'
                    },
                    grid: {
                        display: false // Hide grid lines
                    }
                },
                x: {
                    grid: {
                        display: false // Hide grid lines
                    }
                }
            }
        }
    });
}

function sendTotalsToRedcap(totals, userId) {
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/');
    const apiUrl = `${basePath}/forms/update_form.php`;

    const data = {
        userID: userId,
        pre_stress_total: totals.preStressTotal,
        post_stress_total: totals.postStressTotal,
        test_time_difference: totals.testTimeDifference,
        test_error_difference: totals.testErrorDifference,
        ...totals.groupedScores,
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString(),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Totals successfully sent to REDCap.');
        } else {
            console.error('Error sending totals to REDCap:', data.message);
        }
    })
    .catch((error) => {
        console.error('Fetch error:', error);
    });
}
