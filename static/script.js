document.getElementById("priceForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);

  await fetch("/api/prices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, name, price }),
  });

  loadPrices();
  drawChart();
});

async function loadPrices() {
  const res = await fetch("/api/prices");
  const data = await res.json();
  const list = document.getElementById("priceList");
  list.innerHTML = "";
  data.forEach(([date, name, price]) => {
    const li = document.createElement("li");
    li.textContent = `${date} - ${name} - $${price}`;
    list.appendChild(li);
  });
}

async function scrapePrice() {
  const res = await fetch("/api/scrape_price");
  const data = await res.json();
  document.getElementById("scrapedPrice").textContent = "Scraped Price: $" + data.price;
  // Reload prices and update chart after scraping
  loadPrices();
  drawChart();
}

async function deletePrices() {
  if (confirm("Are you sure you want to delete all prices?")) {
    await fetch("/api/prices", {
      method: "DELETE"
    });
    loadPrices();
    drawChart();
  }
}

let chart = null;

async function drawChart() {
  const res = await fetch("/api/prices");
  const data = await res.json();
  
  // Sort data by date
  data.sort((a, b) => new Date(a[0]) - new Date(b[0]));
  
  const labels = data.map(([date]) => date);
  const prices = data.map(([_, __, price]) => price);

  const ctx = document.getElementById('priceChart').getContext('2d');
  
  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy();
  }

  // Create new chart
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Egg Price ($)',
        data: prices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Price ($)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Egg Price History'
        }
      }
    }
  });
}

// Initial load
loadPrices();
drawChart(); 