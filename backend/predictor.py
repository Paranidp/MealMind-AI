"""
MealMind AI Predictor & Scikit-Learn Pipeline Model Loader
Loads the trained scikit-learn Pipeline from `mealmind_model.pkl` and feeds it
the exact 14 training features per food item for ML inference.

Trained Pipeline architecture:
- ColumnTransformer preprocessing
  - Categorical: OneHotEncoder(handle_unknown="ignore")
    [Day_of_Week, Day_Type, Meal, Food_Item, Holiday_Name, Festival_Name, Festival_Type, Special_Event, Weather]
  - Numerical:
    [Month, Customers, Advance_Bookings, Is_Holiday, Special_Offer]
- RandomForestRegressor (target: Quantity_Prepared)

NOTE:
1. Weather values are strictly restricted to: Normal, Hot, Rainy, Cloudy.
2. Official output contains solely: Food Item | Recommended Quantity | Unit.
3. Zero-mock policy enforced. If `mealmind_model.pkl` is absent,
   a ModelNotFoundError is raised. No fake values, heuristics, or Gemini predictions.
"""

from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any

import pandas as pd

from menu_config import MEAL_MENU_ITEMS, DishMetadata
from schemas import (
    PlanningRequest,
    PredictionResponse,
    MealSectionPrediction,
    PredictedFoodItem,
)

# Standard paths to search for mealmind_model.pkl
BASE_DIR = Path(__file__).resolve().parent
MODEL_SEARCH_PATHS = [
    BASE_DIR / "mealmind_model.pkl",
    BASE_DIR / "models" / "mealmind_model.pkl",
    Path.cwd() / "mealmind_model.pkl",
]

# EXACT feature list used during model training (14 features)
EXACT_FEATURE_COLUMNS = [
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
    "Special_Offer",
]

EXPECTED_FEATURE_COLUMNS = EXACT_FEATURE_COLUMNS

# Allowed Weather values strictly matching model training categories
VALID_WEATHER_VALUES = {"Normal", "Hot", "Rainy", "Cloudy"}


class ModelNotFoundError(Exception):
    """Raised when mealmind_model.pkl cannot be located in the backend."""
    pass


class MealMindMLPredictor:
    """
    Manages loading and inference for the trained scikit-learn Pipeline.
    """

    def __init__(self):
        self._model: Optional[Any] = None
        self._model_path: Optional[Path] = None
        self._attempt_load()

    def _find_model_file(self) -> Optional[Path]:
        for path in MODEL_SEARCH_PATHS:
            if path.exists() and path.is_file():
                return path
        return None

    def _attempt_load(self) -> bool:
        path = self._find_model_file()
        if path:
            try:
                import joblib
                # Load the complete trained scikit-learn Pipeline
                self._model = joblib.load(path)
                self._model_path = path
                return True
            except Exception as e:
                print(f"[MealMind ML] Error loading Pipeline from {path}: {e}")
                self._model = None
        return False

    def is_model_loaded(self) -> bool:
        if self._model is not None:
            return True
        return self._attempt_load()

    def get_model_status(self) -> Tuple[bool, str, Optional[str]]:
        path = self._find_model_file()
        if path and self.is_model_loaded():
            model_type = type(self._model).__name__ if self._model else "Pipeline"
            return True, str(path), model_type
        return False, str(MODEL_SEARCH_PATHS[0]), None

    def construct_prediction_row(
        self,
        meal_slot: str,
        dish: DishMetadata,
        expected_customers: int,
        advance_bookings: int,
        conditions: Any,
    ) -> Dict[str, Any]:
        """
        Constructs a single prediction input row using the EXACT original feature
        names and types expected by the trained scikit-learn Pipeline.

        Categorical features (encoded by OneHotEncoder in Pipeline):
        - Day_of_Week: Monday, Tuesday, etc.
        - Day_Type: Weekend, Weekday
        - Meal: Breakfast, Lunch, Dinner
        - Food_Item: Dosa, Idli, etc.
        - Holiday_Name: Name of holiday or "None"
        - Festival_Name: Name of festival or "None"
        - Festival_Type: Cultural, Religious, etc. or "None"
        - Special_Event: Banquet, Conference, etc. or "None"
        - Weather: Strictly one of [Normal, Hot, Rainy, Cloudy]

        Numerical features:
        - Month: 1 to 12
        - Customers: int (> 0)
        - Advance_Bookings: int (>= 0)
        - Is_Holiday: 1 or 0
        - Special_Offer: 1 or 0
        """
        # Parse date components
        try:
            parsed_date = datetime.strptime(conditions.date, "%Y-%m-%d")
            day_of_week = parsed_date.strftime("%A")
            month = int(parsed_date.month)
        except Exception:
            day_of_week = "Monday"
            month = 1

        # Day_Type: "Weekend" vs "Weekday" (replaces is_weekend)
        day_type = "Weekend" if day_of_week in ("Saturday", "Sunday") else "Weekday"

        # Meal: Capitalized string matching training convention
        meal = meal_slot.strip().capitalize()

        # Food_Item: Exact name from MealMind menu configuration
        food_item = dish["name_en"]

        # Customers & Advance Bookings
        customers = int(expected_customers)
        advance_bookings_val = int(advance_bookings)

        # Holiday fields
        is_holiday_val = 1 if conditions.is_holiday else 0
        holiday_name_val = (
            conditions.holiday_name.strip()
            if (conditions.is_holiday and conditions.holiday_name)
            else "None"
        )

        # Festival fields
        festival_name_val = (
            conditions.festival_name.strip()
            if (conditions.is_festival and conditions.festival_name)
            else "None"
        )
        festival_type_val = (
            conditions.festival_type.strip()
            if (conditions.is_festival and conditions.festival_type)
            else "None"
        )

        # Special Event
        special_event_val = (
            conditions.special_event.strip()
            if (conditions.special_event and conditions.special_event != "None")
            else "None"
        )

        # Weather: strictly Normal, Hot, Rainy, or Cloudy
        raw_weather = conditions.weather.value if hasattr(conditions.weather, "value") else str(conditions.weather)
        weather_clean = raw_weather.strip().capitalize()
        weather_val = weather_clean if weather_clean in VALID_WEATHER_VALUES else "Normal"

        # Special Offer
        special_offer_val = 1 if conditions.special_offer else 0

        return {
            "Day_of_Week": day_of_week,
            "Day_Type": day_type,
            "Month": month,
            "Meal": meal,
            "Food_Item": food_item,
            "Customers": customers,
            "Advance_Bookings": advance_bookings_val,
            "Is_Holiday": is_holiday_val,
            "Holiday_Name": holiday_name_val,
            "Festival_Name": festival_name_val,
            "Festival_Type": festival_type_val,
            "Special_Event": special_event_val,
            "Weather": weather_val,
            "Special_Offer": special_offer_val,
        }

    def predict_plan(self, request: PlanningRequest) -> PredictionResponse:
        """
        Runs inference through the scikit-learn Pipeline (model.predict(input_dataframe))
        for every food item belonging to the selected meals.

        Strict Zero-Mock Policy:
        - Raises ModelNotFoundError if `mealmind_model.pkl` is missing.
        - Uses the Pipeline directly so ColumnTransformer and OneHotEncoder handle categorical encoding.
        - Returns exclusively: Food Item | Recommended Quantity | Unit
        """
        if not self.is_model_loaded():
            model_path_target = self._find_model_file() or MODEL_SEARCH_PATHS[0]
            raise ModelNotFoundError(
                f"Trained model file 'mealmind_model.pkl' not found at {model_path_target}. "
                "Please place your trained scikit-learn Pipeline file in the backend directory."
            )

        sections: List[MealSectionPrediction] = []
        total_customers = 0

        for meal_slot in request.selected_meals:
            slot_key = meal_slot.lower()
            details = request.meal_details.get(slot_key)
            if not details:
                continue

            expected_customers = details.expected_customers
            advance_bookings = details.advance_bookings
            total_customers += expected_customers

            dishes = MEAL_MENU_ITEMS.get(slot_key, [])
            predicted_items: List[PredictedFoodItem] = []

            # Construct one prediction input row for each valid food item of this meal
            feature_rows: List[Dict[str, Any]] = []
            for dish in dishes:
                row = self.construct_prediction_row(
                    meal_slot=slot_key,
                    dish=dish,
                    expected_customers=expected_customers,
                    advance_bookings=advance_bookings,
                    conditions=request.conditions,
                )
                feature_rows.append(row)

            # Build DataFrame using exact feature column order expected by the Pipeline
            input_dataframe = pd.DataFrame(feature_rows)[EXACT_FEATURE_COLUMNS]

            # The Pipeline handles ColumnTransformer preprocessing, OneHotEncoder, and RandomForestRegressor
            raw_predictions = self._model.predict(input_dataframe)

            for dish, pred_val in zip(dishes, raw_predictions):
                # Target variable: Quantity_Prepared
                recommended_qty = max(1.0, float(round(pred_val, 1)))

                # Output strictly: Food Item | Recommended Quantity | Unit
                predicted_items.append(
                    PredictedFoodItem(
                        food_item=dish["name_en"],
                        food_item_ta=dish["name_ta"],
                        recommended_quantity=recommended_qty,
                        unit=dish["unit"],
                        unit_ta=dish["unit_ta"],
                        category=dish["category"],
                    )
                )

            sections.append(
                MealSectionPrediction(
                    meal_slot=slot_key,
                    expected_customers=expected_customers,
                    advance_bookings=advance_bookings,
                    items=predicted_items,
                )
            )

        summary = f"Preparation plan generated for {total_customers} expected customers."

        return PredictionResponse(
            success=True,
            summary=summary,
            total_customers=total_customers,
            date=request.conditions.date,
            model_loaded=True,
            model_source=str(self._model_path),
            sections=sections,
        )


# Singleton instance for the FastAPI application
predictor_instance = MealMindMLPredictor()
