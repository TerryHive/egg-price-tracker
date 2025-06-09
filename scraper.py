import requests
from bs4 import BeautifulSoup

def scrape_egg_price():
    url = "https://amis.afa.gov.tw/view/egg/Egg_Price.aspx"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Failed to fetch page: {response.status_code}")

    soup = BeautifulSoup(response.text, "html.parser")

    # Look for the table with the egg price
    table = soup.find("table", {"id": "GridView1"})
    if not table:
        raise Exception("Couldn't find egg price table")

    rows = table.find_all("tr")
    for row in rows:
        cols = row.find_all("td")
        if len(cols) >= 2 and "雞蛋" in cols[0].text:
            price_text = cols[1].text.strip()
            try:
                return float(price_text)
            except:
                continue

    raise Exception("Couldn't find egg price in the table") 