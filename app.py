from flask import Flask, request, jsonify, render_template
import sqlite3
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime

app = Flask(__name__)

def init_db():
    with sqlite3.connect('prices.db') as conn:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS prices (
            id INTEGER PRIMARY KEY,
            date TEXT NOT NULL,
            name TEXT NOT NULL,
            price REAL NOT NULL
        )''')

def get_egg_price():
    try:
        # Try to get price from a different source
        # For now, we'll return a mock price for demonstration
        # In a real application, you would replace this with actual price data
        mock_prices = {
            "regular": 45.0,
            "organic": 65.0,
            "free_range": 55.0
        }
        
        # Get current date
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        # Return a random price from our mock data
        import random
        price_type = random.choice(list(mock_prices.keys()))
        price = mock_prices[price_type]
        
        # Add the price to our database
        with sqlite3.connect('prices.db') as conn:
            c = conn.cursor()
            c.execute("INSERT INTO prices (date, name, price) VALUES (?, ?, ?)",
                     (current_date, f"Eggs ({price_type})", price))
            conn.commit()
        
        return f"{price} ({price_type})"
        
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/prices', methods=['POST'])
def add_price():
    data = request.get_json()
    with sqlite3.connect('prices.db') as conn:
        c = conn.cursor()
        c.execute("INSERT INTO prices (date, name, price) VALUES (?, ?, ?)",
                  (data['date'], data['name'], data['price']))
        conn.commit()
    return jsonify({'message': 'Price added'}), 201

@app.route('/api/prices', methods=['GET'])
def get_prices():
    with sqlite3.connect('prices.db') as conn:
        c = conn.cursor()
        prices = c.execute("SELECT date, name, price FROM prices").fetchall()
        return jsonify(prices)

@app.route('/api/prices', methods=['DELETE'])
def delete_prices():
    with sqlite3.connect('prices.db') as conn:
        c = conn.cursor()
        c.execute("DELETE FROM prices")
        conn.commit()
    return jsonify({'message': 'All prices deleted'}), 200

@app.route('/api/scrape_price')
def scrape_price():
    price = get_egg_price()
    return jsonify({'price': price})

if __name__ == '__main__':
    init_db()
    app.run(debug=True) 