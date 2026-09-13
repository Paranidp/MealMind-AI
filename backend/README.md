# MealMind AI — Python FastAPI Backend Integration

This directory contains the Python FastAPI backend service prepared to host your trained scikit-learn `Pipeline` model (`mealmind_model.pkl`).

---

## 1. Quick Start Guide

### Step 1: Install Python Dependencies
Ensure you have Python 3.10+ installed. In this directory or a dedicated virtual environment:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 2: Place Your Trained Pipeline Model
Copy your trained scikit-learn pipeline file (`mealmind_model.pkl`) directly into this directory:

```
backend/
├── mealmind_model.pkl   <-- Place your trained model file here
├── main.py
├── predictor.py
├── schemas.py
├── menu_config.py
└── requirements.txt
```

### Step 3: Run the FastAPI Service
Launch the Uvicorn server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation will be available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 2. API Endpoints

### `GET /api/model-status`
Checks if `mealmind_model.pkl` is loaded or pending placement:
```json
{
  "status": "ready",
  "model_found": true,
  "model_path": "/path/to/backend/mealmind_model.pkl",
  "model_type": "Pipeline",
  "expected_features": [
    "Day_of_Week",
    "Day_Type",
    "Month",
    "Meal",
    "Food_Item",
    "Customers",
    "Advance_Bookings",
    "Is_Holiday",
    "Holiday_Name",
    "Festival_Name",
    "Festival_Type",
    "Special_Event",
    "Weather",
    "Special_Offer"
  ],
  "description": "Trained scikit-learn Pipeline (ColumnTransformer + OneHotEncoder + RandomForestRegressor) loaded successfully."
}
```

### `POST /api/predict`
Accepts the manager's planning inputs, creates one row per valid food item with the exact 14 features, and runs `model.predict(input_dataframe)`:

**Request Payload:**
```json
{
  "selected_meals": ["breakfast", "lunch"],
  "meal_details": {
    "breakfast": {
      "expected_customers": 150,
      "advance_bookings": 60
    },
    "lunch": {
      "expected_customers": 220,
      "advance_bookings": 90
    }
  },
  "conditions": {
    "date": "2026-09-15",
    "is_holiday": false,
    "holiday_name": null,
    "is_festival": true,
    "festival_name": "Onam",
    "festival_type": "Cultural",
    "special_event": "Corporate Conference",
    "weather": "Normal",
    "special_offer": false
  }
}
```

**Response Format (Food Item | Recommended Quantity | Unit):**
```json
{
  "success": true,
  "summary": "Preparation plan generated for 370 expected customers.",
  "total_customers": 370,
  "date": "2026-09-15",
  "model_loaded": true,
  "model_source": "backend/mealmind_model.pkl",
  "sections": [
    {
      "meal_slot": "breakfast",
      "expected_customers": 150,
      "advance_bookings": 60,
      "items": [
        {
          "food_item": "Dosa",
          "food_item_ta": "தோசை",
          "recommended_quantity": 210.0,
          "unit": "Pieces",
          "unit_ta": "துண்டுகள்",
          "category": "Tiffin / Griddle"
        },
        {
          "food_item": "Idli",
          "food_item_ta": "இட்லி",
          "recommended_quantity": 330.0,
          "unit": "Pieces",
          "unit_ta": "துண்டுகள்",
          "category": "Steamed Tiffin"
        }
      ]
    }
  ]
}
```

---

## 3. Scikit-Learn Model Specification & Exact Feature List

The backend uses `model = joblib.load("backend/mealmind_model.pkl")` and feeds a pandas DataFrame directly to `model.predict(input_dataframe)` containing these exact 14 features:

| Feature Name | Type | Processing | Description / Values |
| :--- | :--- | :--- | :--- |
| `Day_of_Week` | String | Categorical (`OneHotEncoder`) | Day name (e.g., `Monday`, `Tuesday`, `Sunday`) |
| `Day_Type` | String | Categorical (`OneHotEncoder`) | `Weekend` (if Sat/Sun) or `Weekday` |
| `Month` | Integer | Numerical | Month number `1` to `12` |
| `Meal` | String | Categorical (`OneHotEncoder`) | `Breakfast`, `Lunch`, `Dinner` |
| `Food_Item` | String | Categorical (`OneHotEncoder`) | Dish name (`Dosa`, `Idli`, `Biryani`, etc.) |
| `Customers` | Integer | Numerical | Expected diner headcount (> 0) |
| `Advance_Bookings` | Integer | Numerical | Confirmed reservation count (≥ 0) |
| `Is_Holiday` | Integer | Numerical | `1` if holiday, `0` otherwise |
| `Holiday_Name` | String | Categorical (`OneHotEncoder`) | Holiday title or `"None"` |
| `Festival_Name` | String | Categorical (`OneHotEncoder`) | Festival title or `"None"` |
| `Festival_Type` | String | Categorical (`OneHotEncoder`) | Festival category or `"None"` |
| `Special_Event` | String | Categorical (`OneHotEncoder`) | Event description or `"None"` |
| `Weather` | String | Categorical (`OneHotEncoder`) | Strictly: `Normal`, `Hot`, `Rainy`, `Cloudy` |
| `Special_Offer` | Integer | Numerical | `1` if promotional discount active, `0` otherwise |

### Target Variable
* `Quantity_Prepared` (unit is retrieved from MealMind menu configuration)

### Output Format
The official output strictly contains:
**Food Item | Recommended Quantity | Unit**

### Strict Zero-Mock Policy
- If `mealmind_model.pkl` is absent, the backend returns HTTP 404 with a `ModelNotFoundError`.
- No fake predictions, synthetic values, or LLM-generated numbers are produced.
