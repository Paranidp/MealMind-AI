# MealMind AI

## AI-Powered Food Demand Forecasting & Preparation Planning System

MealMind AI is an AI-powered food demand forecasting and preparation planning system designed for hotels and restaurants.

The system helps hotel managers estimate the quantity of food that should be prepared based on expected customers, advance bookings, meal timings, date-related factors, festivals, holidays, weather, special events, and promotional offers.

Instead of providing only customer counts, MealMind AI produces a preparation plan with:

**Food Item → Recommended Quantity → Unit**

---

## 1. Problem Statement

Hotels and restaurants often prepare food based on manual estimation and previous experience. Over-preparation can cause food waste, while under-preparation can lead to shortages and poor customer experience.

MealMind AI addresses this problem by using a trained machine learning model to estimate food preparation quantities from operational and contextual inputs.

---

## 2. Objectives

- Forecast food preparation quantities using machine learning.
- Consider expected customers and advance bookings.
- Support Breakfast, Lunch, and Dinner planning.
- Consider holidays, festivals, special events, weather, and offers.
- Provide recommended quantities with appropriate measurement units.
- Provide a structured preparation plan for kitchen operations.
- Provide a web-based interface for hotel managers.

---

## 3. System Architecture

```text
Hotel Manager
      |
      v
React + TypeScript Frontend
      |
      | HTTP / JSON
      v
FastAPI Backend
      |
      v
MealMind ML Predictor
      |
      v
Scikit-learn Pipeline
      |
      v
Random Forest Regressor
      |
      v
Food Preparation Plan
(Quantity + Unit)
```

---

## 4. Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

### Backend
- Python
- FastAPI
- Pydantic
- Pandas
- Joblib
- Scikit-learn
- Uvicorn

### Machine Learning
- Scikit-learn Pipeline
- ColumnTransformer
- OneHotEncoder
- RandomForestRegressor

### Deployment
- Vercel
- Render

---

## 5. Machine Learning Model

MealMind AI uses a trained Scikit-learn Pipeline containing preprocessing and a Random Forest Regressor.

The trained model is stored as:

`mealmind_model.pkl`

The model predicts:

`Quantity_Prepared`

The prediction system uses the following features:

| Feature | Description |
|---|---|
| Day_of_Week | Day of the week |
| Day_Type | Weekday or Weekend |
| Month | Month number |
| Meal | Breakfast, Lunch, or Dinner |
| Food_Item | Food item |
| Customers | Expected customer count |
| Advance_Bookings | Confirmed bookings |
| Is_Holiday | Holiday indicator |
| Holiday_Name | Holiday name |
| Festival_Name | Festival name |
| Festival_Type | Festival category |
| Special_Event | Special event information |
| Weather | Weather condition |
| Special_Offer | Promotional offer indicator |

### Model Performance

The trained model was evaluated during development with:

- **MAE:** 7.17
- **RMSE:** 10.55
- **R² Score:** 0.9766

---

## 6. API Documentation

The frontend communicates with the Python FastAPI prediction service.

### Health Check

**Endpoint**

`GET /api/health`

Checks whether the FastAPI service is operational.

### Model Status

**Endpoint**

`GET /api/model-status`

Checks whether the trained machine learning model is available and loaded.

### Food Preparation Prediction

**Endpoint**

`POST /api/predict`

Receives meal planning conditions and generates food preparation quantities using the trained machine learning model.

### Main Input Information

- Selected meals
- Expected customers
- Advance bookings
- Date
- Holiday information
- Festival information
- Special event
- Weather
- Special offer

### Output

The API returns a structured preparation plan containing:

- Meal slot
- Expected customers
- Advance bookings
- Food item
- Recommended quantity
- Measurement unit

---

## 7. Input Validation

The backend uses Pydantic schemas for request validation.

Important validation rules include:

- Expected customers must be greater than zero.
- Advance bookings cannot be negative.
- Advance bookings cannot exceed expected customers.
- At least one meal must be selected.
- Only supported meal slots are accepted.
- Weather values are validated against the supported values.

Invalid requests are rejected before the machine learning prediction is performed.

---

## 8. Error Handling

MealMind AI handles errors at both the frontend and backend levels.

### Backend Error Handling

The backend handles:

- Missing machine learning model
- Invalid request data
- Prediction/inference failures
- Unexpected server errors

### Frontend Error Handling

The frontend handles:

- Backend connection failures
- HTTP errors
- Model availability errors
- Invalid backend responses
- Network failures

The application displays a user-friendly error message instead of silently producing incorrect prediction values.

### Zero-Mock Prediction Policy

MealMind AI does not replace a failed ML prediction with fabricated values.

If the ML service or trained model is unavailable, the application reports the problem.

---

## 9. Testing and Validation

The project includes request validation and functional validation of the prediction workflow.

| Test Case | Condition | Expected Result |
|---|---|---|
| Valid prediction | Valid meal and customer information | Prediction generated |
| Empty meal selection | No meal selected | Request rejected |
| Invalid meal | Unsupported meal | Request rejected |
| Zero customers | Customer count is zero | Validation error |
| Negative customers | Negative customer count | Validation error |
| Negative bookings | Negative booking count | Validation error |
| Excess bookings | Bookings exceed customers | Validation error |
| Invalid weather | Unsupported weather value | Validation error |
| Missing model | Model unavailable | Model error returned |
| Backend unavailable | API cannot be reached | Frontend displays error |
| Prediction failure | ML inference fails | Server error returned |

These tests focus on input validation, API behavior, model availability, and error handling.

---

## 10. Application Workflow

```text
Manager
   |
   v
Login
   |
   v
Select Breakfast / Lunch / Dinner
   |
   v
Enter Expected Customers
   |
   v
Enter Advance Bookings
   |
   v
Enter Date and Conditions
   |
   v
Frontend Validation
   |
   v
FastAPI Prediction API
   |
   v
Pydantic Validation
   |
   v
ML Feature Construction
   |
   v
Random Forest Model
   |
   v
Food Quantity Prediction
   |
   v
Preparation Plan
```

---

## 11. Data and Storage Architecture

The application separates the prediction process from the user interface.

```text
User Input
    |
    v
React Application
    |
    v
FastAPI API
    |
    v
Machine Learning Model
    |
    v
Prediction Result
    |
    v
Preparation Plan
```

The application uses authentication and application-level data management for the user and preparation-planning workflow.

No sensitive credentials or private API keys should be committed to the public repository.

---

## 12. Project Structure

```text
MealMind-AI/
|
├── src/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── App.tsx
│   ├── types.ts
│   └── translations.ts
|
├── backend/
│   ├── main.py
│   ├── predictor.py
│   ├── schemas.py
│   ├── menu_config.py
│   ├── mealmind_model.pkl
│   ├── requirements.txt
│   └── Dockerfile
|
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── vercel.json
```

---

## 13. Deployment

### Frontend

The MealMind AI frontend is deployed using Vercel.

### Backend

The Python FastAPI machine learning service is deployed separately using Render.

The frontend communicates with the deployed backend through HTTP API requests.

---

## 14. Key Features

- AI-based food demand forecasting
- Food preparation quantity prediction
- Breakfast, Lunch and Dinner planning
- Customer and booking-based forecasting
- Holiday and festival consideration
- Weather consideration
- Special-event consideration
- Special-offer consideration
- ML model status monitoring
- Input validation
- Error handling
- Responsive web interface

---

## 15. Review 2 Improvements

The second review extends the initial project implementation with improved technical documentation covering:

- API endpoints
- Machine learning model integration
- Input validation
- Error handling
- Testing and validation
- Application architecture
- Data and storage architecture
- Deployment architecture
- Project structure

The existing trained machine learning model and prediction pipeline remain unchanged.

---

## 16. Future Scope

Future improvements may include:

- Historical prediction analytics
- Ingredient-level demand forecasting
- Inventory planning
- Food waste tracking
- Cost optimization
- Automated model retraining using real hotel data
- Multi-hotel management dashboards

---

## Author

**Paranitharan V**

### MealMind AI

**AI-Powered Food Demand Forecasting & Preparation Planning System**
