"""
Paytm Merchant Growth Agent — Indian Kirana Synthetic Dataset Generator
Generates 50,000+ realistic transaction records for Laxmi Kirana, Jaipur over a 1-year window (Sept 2025 - Sept 2026).
Captures diurnal double-peaks, monsoon rain surges, festive spikes, supplier lead times, and SKU stockouts.
"""

import os
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_dataset(num_records=55000, output_path="ml/data/kirana_transactions.csv"):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    random.seed(42)
    np.random.seed(42)

    print(f"Generating {num_records} realistic Indian Kirana UPI transactions...")

    # Realistic SKUs across key kirana categories
    SKU_CATALOG = [
        {"sku": "AML-MK-500", "name": "Amul Taaza Toned Milk (500ml)", "cat": "Dairy", "price": 27, "cost": 24, "shelf_life": 2, "lead_time_h": 4},
        {"sku": "AML-BTR-500", "name": "Amul Salted Butter (500g)", "cat": "Dairy", "price": 275, "cost": 252, "shelf_life": 90, "lead_time_h": 24},
        {"sku": "MDN-CURD-400", "name": "Mother Dairy Dahi (400g)", "cat": "Dairy", "price": 35, "cost": 31, "shelf_life": 5, "lead_time_h": 6},
        {"sku": "MAG-NOD-70G", "name": "Maggi 2-Minute Masala Noodles (70g)", "cat": "Packaged Goods", "price": 14, "cost": 12, "shelf_life": 240, "lead_time_h": 24},
        {"sku": "PRL-PLG-1KG", "name": "Parle-G Gold Biscuits (1kg)", "cat": "Packaged Goods", "price": 90, "cost": 78, "shelf_life": 180, "lead_time_h": 48},
        {"sku": "TAT-TEA-250", "name": "Tata Tea Premium (250g)", "cat": "Beverages", "price": 140, "cost": 122, "shelf_life": 365, "lead_time_h": 48},
        {"sku": "BRU-COF-50G", "name": "Bru Instant Coffee (50g jar)", "cat": "Beverages", "price": 115, "cost": 100, "shelf_life": 365, "lead_time_h": 48},
        {"sku": "THU-SDA-750", "name": "Thums Up Charged (750ml PET)", "cat": "Beverages", "price": 40, "cost": 34, "shelf_life": 180, "lead_time_h": 24},
        {"sku": "ASH-ATT-5KG", "name": "Aashirvaad Shudh Chakki Atta (5kg)", "cat": "Staples", "price": 260, "cost": 235, "shelf_life": 90, "lead_time_h": 48},
        {"sku": "FRT-OIL-1L", "name": "Fortune Kachi Ghani Mustard Oil (1L)", "cat": "Staples", "price": 155, "cost": 138, "shelf_life": 270, "lead_time_h": 48},
        {"sku": "TAT-SLT-1KG", "name": "Tata Salt Vacuum Evaporated (1kg)", "cat": "Staples", "price": 28, "cost": 24, "shelf_life": 720, "lead_time_h": 72},
        {"sku": "DET-SOAP-75", "name": "Dettol Original Soap (75g)", "cat": "Personal Care", "price": 38, "cost": 33, "shelf_life": 720, "lead_time_h": 72},
        {"sku": "CLS-PST-150", "name": "Colgate Strong Teeth Toothpaste (150g)", "cat": "Personal Care", "price": 98, "cost": 86, "shelf_life": 720, "lead_time_h": 72},
        {"sku": "SUR-DET-1KG", "name": "Surf Excel Quick Wash Powder (1kg)", "cat": "Home Care", "price": 145, "cost": 128, "shelf_life": 720, "lead_time_h": 48},
        {"sku": "LAY-CHIP-50", "name": "Lay's India's Magic Masala (50g)", "cat": "Snacks", "price": 20, "cost": 17, "shelf_life": 120, "lead_time_h": 24},
    ]

    # Pool of 1,200 distinct local customer UPI handles
    customer_ids = [f"user_{i:04d}@paytm" for i in range(1, 1201)]
    # 20% of customers are frequent society residents (higher probability of selection)
    loyal_customers = customer_ids[:240]
    regular_customers = customer_ids[240:800]
    occasional_customers = customer_ids[800:]

    start_date = datetime(2025, 9, 18)
    end_date = datetime(2026, 9, 18)
    total_seconds = int((end_date - start_date).total_seconds())

    # Festival dates (Diwali, Holi, New Year, Raksha Bandhan)
    festivals = [
        datetime(2025, 10, 20), # Diwali week
        datetime(2025, 12, 31), # New Year Eve
        datetime(2026, 3, 4),   # Holi week
        datetime(2026, 8, 28),  # Rakhi week
    ]

    records = []
    # Current simulated inventory shelf stocks for tracking depletions
    stock_levels = {s["sku"]: random.randint(15, 60) for s in SKU_CATALOG}

    sku_dict = {s["sku"]: s for s in SKU_CATALOG}

    for i in range(num_records):
        # Pick timestamp with realistic retail time distribution
        sec_offset = random.randint(0, total_seconds)
        dt = start_date + timedelta(seconds=sec_offset)
        
        # Adjust hour to operating hours: peak morning (8-10 AM) and evening rush (6-9 PM)
        rand_hour_draw = random.random()
        if rand_hour_draw < 0.28: # morning rush
            hour = random.choice([7, 8, 9, 10])
        elif rand_hour_draw < 0.70: # evening peak rush
            hour = random.choice([18, 19, 20, 21])
        elif rand_hour_draw < 0.88: # afternoon
            hour = random.choice([11, 12, 13, 16, 17])
        else: # slow midday
            hour = random.choice([14, 15, 22])
            
        dt = dt.replace(hour=hour, minute=random.randint(0, 59), second=random.randint(0, 59))

        # Check seasonality factors
        is_weekend = dt.weekday() >= 5
        is_monsoon = dt.month in [6, 7, 8, 9] # monsoon months
        is_raining = is_monsoon and (random.random() < 0.28)
        
        is_festival = any(abs((dt - f).days) <= 3 for f in festivals)
        is_ipl_match = dt.month in [4, 5] and hour in [19, 20, 21] and (random.random() < 0.6)

        # Select Customer based on weighted probability
        c_draw = random.random()
        if c_draw < 0.55:
            cust = random.choice(loyal_customers)
        elif c_draw < 0.85:
            cust = random.choice(regular_customers)
        else:
            cust = random.choice(occasional_customers)

        # Select SKU based on weather and hour
        if is_raining and random.random() < 0.65:
            sku_code = random.choice(["TAT-TEA-250", "PRL-PLG-1KG", "MAG-NOD-70G", "LAY-CHIP-50"])
            sku_info = sku_dict.get(sku_code, random.choice(SKU_CATALOG))
        elif hour in [7, 8, 9] and random.random() < 0.60:
            sku_code = random.choice(["AML-MK-500", "AML-BTR-500", "MDN-CURD-400"])
            sku_info = sku_dict.get(sku_code, random.choice(SKU_CATALOG))
        elif is_ipl_match and random.random() < 0.70:
            sku_code = random.choice(["THU-SDA-750", "LAY-CHIP-50", "MAG-NOD-70G"])
            sku_info = sku_dict.get(sku_code, random.choice(SKU_CATALOG))
        else:
            sku_info = random.choice(SKU_CATALOG)

        # Quantity purchased
        qty = 1 if sku_info["price"] > 100 else random.choices([1, 2, 3, 4], weights=[0.60, 0.25, 0.10, 0.05])[0]
        if is_festival:
            qty = max(qty, random.choice([2, 3, 4]))

        total_amount = round(qty * sku_info["price"], 2)
        gross_margin = round(qty * (sku_info["price"] - sku_info["cost"]), 2)

        # Track stock depletion and determine stockout label
        sku_key = sku_info["sku"]
        current_stock = stock_levels[sku_key]
        stock_levels[sku_key] = max(0, current_stock - qty)

        # Periodic distributor restock replenishment
        if stock_levels[sku_key] <= 5:
            stock_levels[sku_key] += random.choice([24, 48, 72]) # Distributor delivery arrived

        # Stockout risk indicator: stock is below 1.5x expected daily depletion and cutoff < 4h
        stockout_imminent = 1 if (stock_levels[sku_key] < 8 and (hour in [10, 11, 16, 17])) else 0

        records.append({
            "transaction_id": f"TX_{dt.strftime('%Y%m%d%H%M')}_{i:05d}",
            "timestamp": dt.isoformat(),
            "date": dt.strftime("%Y-%m-%d"),
            "hour": hour,
            "day_of_week": dt.weekday(),
            "is_weekend": int(is_weekend),
            "customer_id": cust,
            "sku": sku_info["sku"],
            "sku_name": sku_info["name"],
            "category": sku_info["cat"],
            "quantity": qty,
            "unit_price": sku_info["price"],
            "unit_cost": sku_info["cost"],
            "total_amount": total_amount,
            "gross_margin": gross_margin,
            "payment_channel": "Paytm Soundbox QR",
            "is_raining": int(is_raining),
            "is_festival": int(is_festival),
            "is_ipl_match": int(is_ipl_match),
            "current_shelf_stock": current_stock,
            "supplier_lead_time_h": sku_info["lead_time_h"],
            "stockout_within_24h": stockout_imminent,
        })

    df = pd.DataFrame(records)
    # Sort chronologically
    df = df.sort_values(by="timestamp").reset_index(drop=True)
    df.to_csv(output_path, index=False)
    print(f"[SUCCESS] Generated {len(df)} records saved to {output_path}")
    print(f"Total GMV: Rs. {df['total_amount'].sum():,.2f}")
    print(f"Distinct Customers: {df['customer_id'].nunique()}")
    print(f"Stockout labels tagged: {df['stockout_within_24h'].sum()} occurrences")
    return df

if __name__ == "__main__":
    generate_dataset()
