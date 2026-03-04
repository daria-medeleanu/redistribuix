from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import uvicorn
import pandas as pd
import numpy as np
import joblib
from datetime import datetime, timedelta

app = FastAPI(title="RedistribuX ML API")

# 1. Încărcăm modelul la pornire
try:
    model = joblib.load('model.pkl') 
    print("Model ML încărcat cu succes!")
except Exception as e:
    print(f"Atenție: Nu am găsit modelul! Eroare: {e}")
    model = None

# 2. Forma JSON-ului pe care îl primim de la .NET
class ForecastRequest(BaseModel):
    location_id: str
    product_id: str
    start_date: str               # "YYYY-MM-DD"
    recent_sales_30_days: List[float] 
    forecast_horizon: int = 100   
    profile_type_encoded: int
    purchasing_power_encoded: int
    # NOU: stocul curent, pentru a putea calcula days_of_stock
    current_stock: float

# 3. Logica Autoregresivă
@app.post("/forecast")
def forecast_sales(data: ForecastRequest):
    history = list(data.recent_sales_30_days)
    
    current_date = datetime.strptime(data.start_date, "%Y-%m-%d")
    total_predicted_sales = 0
    
    for i in range(data.forecast_horizon):
        target_date = current_date + timedelta(days=i)
        
        # Extragem features calendaristice
        day_of_week = target_date.weekday()
        is_weekend = 1 if day_of_week >= 5 else 0
        day_of_month = target_date.day
        month = target_date.month
        is_after_payday = 1 if 15 <= target_date.day <= 17 else 0
        
        # Extragem lag-urile si mediile
        sales_lag_7 = history[-7]
        sales_lag_14 = history[-14]
        sales_lag_30 = history[-30]
        rolling_mean_7 = np.mean(history[-7:])
        rolling_mean_30 = np.mean(history[-30:])
        
        active_multiplier = 1.0 
        
        # --- ORDINEA EXACTĂ DIN FIT ---
        input_df = pd.DataFrame([{
            'day_of_week': day_of_week,
            'is_weekend': is_weekend,
            'day_of_month': day_of_month,
            'month': month,
            'is_after_payday': is_after_payday,
            'sales_lag_7': sales_lag_7,
            'sales_lag_14': sales_lag_14,
            'sales_lag_30': sales_lag_30,
            'rolling_mean_7': rolling_mean_7,
            'rolling_mean_30': rolling_mean_30,
            'active_multiplier': active_multiplier,
            'profile_type_encoded': data.profile_type_encoded,
            'purchasing_power_encoded': data.purchasing_power_encoded
        }])
        
        # Predicția
        if model is not None:
            daily_pred = model.predict(input_df)[0]
        else:
            daily_pred = (rolling_mean_7 * 0.9) + (is_weekend * 2)
            
        daily_pred_qty = max(0, int(round(daily_pred)))
        
        history.append(daily_pred_qty)
        total_predicted_sales += daily_pred_qty

    # media vânzărilor zilnice pe orizontul de forecast
    forecast_horizon_days = data.forecast_horizon
    if forecast_horizon_days > 0:
        predicted_daily_sales = total_predicted_sales / forecast_horizon_days
    else:
        predicted_daily_sales = 0.0

    # calculăm days_of_stock_ml și clasificarea pe baza stocului curent
    # folosim un prag minim pentru a evita împărțirea la 0
    safe_daily = max(predicted_daily_sales, 0.01)
    days_of_stock_ml = round(data.current_stock / safe_daily, 1)

    if days_of_stock_ml > 45:
        stock_status = "DEAD_STOCK"
    elif days_of_stock_ml < 14:
        stock_status = "STOCKOUT_RISK"
    else:
        stock_status = "NORMAL"

    return {
        "location_id": data.location_id,
        "product_id": data.product_id,
        "forecast_horizon_days": forecast_horizon_days,
        "total_predicted_quantity": int(total_predicted_sales),
        "predicted_daily_sales": round(predicted_daily_sales, 3),
        "days_of_stock_ml": days_of_stock_ml,
        "stock_status": stock_status
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)