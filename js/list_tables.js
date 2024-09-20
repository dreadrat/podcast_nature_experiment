document.addEventListener('DOMContentLoaded', function() {
    fetch('fetch_tables.php')
        .then(response => response.json())
        .then(data => {
            const tablesDiv = document.getElementById('tables');
            for (const table in data) {
                const tableDiv = document.createElement('div');
                tableDiv.classList.add('table-container');

                const tableTitle = document.createElement('h2');
                tableTitle.textContent = table;
                tableDiv.appendChild(tableTitle);

                if (data[table].length > 0) {
                    const tableElement = document.createElement('table');
                    const headerRow = document.createElement('tr');

                    // Create table headers
                    for (const key in data[table][0]) {
                        const th = document.createElement('th');
                        th.textContent = key;
                        headerRow.appendChild(th);
                    }
                    tableElement.appendChild(headerRow);

                    // Create table rows
                    data[table].forEach(row => {
                        const tr = document.createElement('tr');
                        for (const key in row) {
                            const td = document.createElement('td');
                            td.textContent = row[key];
                            tr.appendChild(td);
                        }
                        tableElement.appendChild(tr);
                    });

                    tableDiv.appendChild(tableElement);
                } else {
                    const noData = document.createElement('p');
                    noData.textContent = 'No data available';
                    tableDiv.appendChild(noData);
                }

                tablesDiv.appendChild(tableDiv);
            }
        })
        .catch(error => console.error('Error:', error));
});
