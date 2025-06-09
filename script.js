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
    
    prices.forEach((price, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${price.date}</td>
            <td>${price.price}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deletePrice(${index})">Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    const entryCount = prices.length;
    const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / entryCount;
    const minPrice = Math.min(...prices.map(p => p.price));
    const maxPrice = Math.max(...prices.map(p => p.price));
    const minDate = prices.find(p => p.price === minPrice).date;
    const maxDate = prices.find(p => p.price === maxPrice).date;
    const priceChange = entryCount > 1 ? ((prices[entryCount - 1].price - prices[entryCount - 2].price) / prices[entryCount - 2].price) * 100 : 0;

    document.getElementById('entryCount').textContent = entryCount;
    document.getElementById('avgPrice').textContent = avgPrice.toFixed(2);
    document.getElementById('minPrice').textContent = minPrice.toFixed(2);
    document.getElementById('minDate').textContent = minDate;
    document.getElementById('maxPrice').textContent = maxPrice.toFixed(2);
    document.getElementById('maxDate').textContent = maxDate;
    document.getElementById('priceChange').textContent = priceChange.toFixed(2);
}

// Handle form submission
document.getElementById('priceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const price = parseFloat(document.getElementById('price').value);
    
    prices.push({ date, price });
    localStorage.setItem('eggPrices', JSON.stringify(prices));
    
    updateChart();
    updateTable();
    updateStats();
    
    this.reset();
});

// Delete price entry
function deletePrice(index) {
    if (confirm('Are you sure you want to delete this price entry?')) {
        prices.splice(index, 1);
        localStorage.setItem('eggPrices', JSON.stringify(prices));
        updateChart();
        updateTable();
        updateStats();
    }
}

// Initialize the page
function init() {
    initChart();
    updateTable();
    updateStats();
}

// Call init when the page loads
document.addEventListener('DOMContentLoaded', init); 