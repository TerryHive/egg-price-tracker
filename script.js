// Initialize Chart.js
let priceChart;
const ctx = document.getElementById('priceChart').getContext('2d');

// Initialize data from localStorage or empty array
let prices = JSON.parse(localStorage.getItem('eggPrices')) || [];

// Initialize chart
function initChart() {
    const labels = prices.map(p => p.date);
    const data = prices.map(p => p.price);
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Egg Prices (NT$)',
                data: data,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update chart with new data
function updateChart() {
    const labels = prices.map(p => p.date);
    const data = prices.map(p => p.price);
    
    priceChart.data.labels = labels;
    priceChart.data.datasets[0].data = data;
    priceChart.update();
}

// Update price table
function updateTable() {
    const table = document.getElementById('priceTable');
    table.innerHTML = '';
    
    prices.forEach(price => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${price.date}</td>
            <td>${price.name}</td>
            <td>${price.price}</td>
        `;
        table.appendChild(row);
    });
}

// Handle form submission
document.getElementById('priceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const date = new Date().toLocaleDateString();
    
    prices.push({ date, name, price });
    localStorage.setItem('eggPrices', JSON.stringify(prices));
    
    updateChart();
    updateTable();
    
    this.reset();
});

// Initialize the page
function init() {
    initChart();
    updateTable();
}

// Call init when the page loads
document.addEventListener('DOMContentLoaded', init); 