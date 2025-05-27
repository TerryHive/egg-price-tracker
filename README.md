# Egg Price Tracker

A web application for tracking and visualizing egg prices from various sources.

## Features

- Track egg prices manually or through web scraping
- Visualize price trends with interactive charts
- Store price history in a SQLite database
- Modern web interface built with Flask and Chart.js

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/egg-price-tracker.git
cd egg-price-tracker
```

2. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the Flask application:
```bash
python app.py
```

2. Open your browser and navigate to `http://localhost:5000`

3. Use the interface to:
   - Add prices manually
   - Scrape prices from PXMart
   - View price history and trends
   - Clear price data if needed

## Dependencies

- Flask 3.0.2
- Requests 2.31.0
- BeautifulSoup4 4.12.3

## License

MIT License 