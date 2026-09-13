"""
MealMind AI Predictor & Scikit-Learn Pipeline Model Loader

Loads the trained scikit-learn Pipeline from `mealmind_model.pkl`
and feeds it the exact 14 training features per food item for ML inference.

Trained Pipeline architecture:
- ColumnTransformer preprocessing
  - Categorical:
    [Day_of_Week, Day_Type, Meal, Food_Item, Holiday_Name,
     Festival_Name, Festival_Type, Special_Event, Weather]
  - Numerical:
    [Month, Customers, Advance_Bookings, Is_Holiday, Special_Offer]
- RandomForestRegressor
- Target: Quantity_Prepared

Zero-mock policy:
If `mealmind_model.pkl` is absent or cannot be loaded,
the backend does not generate fake predictions.
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


# ---------------------------------------------------------
# MODEL PATHS
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

MODEL_SEARCH_PATHS = [
    BASE_DIR / "mealmind_model.pkl",
    BASE_DIR / "models" / "mealmind_model.pkl",
    Path.cwd() / "mealmind_model.pkl",
]


# ---------------------------------------------------------
# EXACT FEATURES USED DURING TRAINING
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# VALID WEATHER VALUES
# ---------------------------------------------------------

VALID_WEATHER_VALUES = {
    "Normal",
    "Hot",
    "Rainy",
    "Cloudy",
}


# ---------------------------------------------------------
# MODEL ERROR
# ---------------------------------------------------------

class ModelNotFoundError(Exception):
    """Raised when mealmind_model.pkl cannot be located."""
    pass


# ---------------------------------------------------------
# ML PREDICTOR
# ---------------------------------------------------------

class MealMindMLPredictor:
    """
    Manages loading and inference for the trained
    scikit-learn Pipeline.
    """

    def __init__(self):
        self._model: Optional[Any] = None
        self._model_path: Optional[Path] = None

        self._attempt_load()


    # -----------------------------------------------------
    # FIND MODEL FILE
    # -----------------------------------------------------

    def _find_model_file(self) -> Optional[Path]:

        for path in MODEL_SEARCH_PATHS:

            if path.exists() and path.is_file():
                return path

        return None


    # -----------------------------------------------------
    # LOAD MODEL
    # -----------------------------------------------------

    def _attempt_load(self) -> bool:

        path = self._find_model_file()

        if path:

            try:

                import joblib

                self._model = joblib.load(path)
                self._model_path = path

                print(
                    f"[MealMind ML] Model loaded successfully from {path}"
                )

                return True

            except Exception as e:

                print(
                    f"[MealMind ML] Error loading Pipeline from {path}: {e}"
                )

                self._model = None

        return False


    # -----------------------------------------------------
    # CHECK MODEL
    # -----------------------------------------------------

    def is_model_loaded(self) -> bool:

        if self._model is not None:
            return True

        return self._attempt_load()


    # -----------------------------------------------------
    # MODEL STATUS
    # -----------------------------------------------------

    def get_model_status(
        self,
    ) -> Tuple[bool, str, Optional[str]]:

        path = self._find_model_file()

        if path and self.is_model_loaded():

            model_type = (
                type(self._model).__name__
                if self._model
                else "Pipeline"
            )

            return (
                True,
                str(path),
                model_type,
            )

        return (
            False,
            str(MODEL_SEARCH_PATHS[0]),
            None,
        )


    # -----------------------------------------------------
    # CONSTRUCT ONE ML INPUT ROW
    # -----------------------------------------------------

    def construct_prediction_row(
        self,
        meal_slot: str,
        dish: DishMetadata,
        expected_customers: int,
        advance_bookings: int,
        conditions: Any,
    ) -> Dict[str, Any]:

        # -------------------------------------------------
        # DATE
        # -------------------------------------------------

        try:

            parsed_date = datetime.strptime(
                conditions.date,
                "%Y-%m-%d",
            )

            day_of_week = parsed_date.strftime("%A")
            month = int(parsed_date.month)

        except Exception:

            day_of_week = "Monday"
            month = 1


        # -------------------------------------------------
        # DAY TYPE
        # -------------------------------------------------

        day_type = (
            "Weekend"
            if day_of_week in ("Saturday", "Sunday")
            else "Weekday"
        )


        # -------------------------------------------------
        # MEAL
        # -------------------------------------------------

        meal = meal_slot.strip().capitalize()


        # -------------------------------------------------
        # FOOD ITEM
        # -------------------------------------------------

        food_item = dish["name_en"]


        # -------------------------------------------------
        # CUSTOMERS
        # -------------------------------------------------

        customers = int(expected_customers)


        # -------------------------------------------------
        # ADVANCE BOOKINGS
        # -------------------------------------------------

        advance_bookings_val = int(advance_bookings)


        # -------------------------------------------------
        # HOLIDAY
        # -------------------------------------------------

        is_holiday_val = (
            1
            if conditions.is_holiday
            else 0
        )

        holiday_name_val = (
            conditions.holiday_name.strip()
            if (
                conditions.is_holiday
                and conditions.holiday_name
            )
            else "None"
        )


        # -------------------------------------------------
        # FESTIVAL
        # -------------------------------------------------

        festival_name_val = (
            conditions.festival_name.strip()
            if (
                conditions.is_festival
                and conditions.festival_name
            )
            else "None"
        )

        festival_type_val = (
            conditions.festival_type.strip()
            if (
                conditions.is_festival
                and conditions.festival_type
            )
            else "None"
        )


        # -------------------------------------------------
        # SPECIAL EVENT
        # -------------------------------------------------

        special_event_val = (
            conditions.special_event.strip()
            if (
                conditions.special_event
                and conditions.special_event != "None"
            )
            else "None"
        )


        # -------------------------------------------------
        # WEATHER
        # -------------------------------------------------

        raw_weather = (
            conditions.weather.value
            if hasattr(conditions.weather, "value")
            else str(conditions.weather)
        )

        weather_clean = raw_weather.strip().capitalize()

        weather_val = (
            weather_clean
            if weather_clean in VALID_WEATHER_VALUES
            else "Normal"
        )


        # -------------------------------------------------
        # SPECIAL OFFER
        # -------------------------------------------------

        special_offer_val = (
            1
            if conditions.special_offer
            else 0
        )


        # -------------------------------------------------
        # RETURN EXACT 14 FEATURES
        # -------------------------------------------------

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


    # -----------------------------------------------------
    # PREDICT COMPLETE MEAL PLAN
    # -----------------------------------------------------

    def predict_plan(
        self,
        request: PlanningRequest,
    ) -> PredictionResponse:

        # -------------------------------------------------
        # CHECK MODEL
        # -------------------------------------------------

        if not self.is_model_loaded():

            model_path_target = (
                self._find_model_file()
                or MODEL_SEARCH_PATHS[0]
            )

            raise ModelNotFoundError(
                f"Trained model file 'mealmind_model.pkl' "
                f"not found at {model_path_target}."
            )


        # -------------------------------------------------
        # INITIAL VALUES
        # -------------------------------------------------

        sections: List[MealSectionPrediction] = []

        total_customers = 0


        # -------------------------------------------------
        # PROCESS EACH SELECTED MEAL
        # -------------------------------------------------

        for meal_slot in request.selected_meals:

            # Convert meal name to lowercase for menu lookup
            slot_key = meal_slot.lower()

            # IMPORTANT:
            # Support both "Breakfast" and "breakfast"
            # as dictionary keys.
            details = (
                request.meal_details.get(meal_slot)
                or request.meal_details.get(slot_key)
            )

            # If no details exist, skip this meal.
            if not details:
                continue


            # -------------------------------------------------
            # CUSTOMER DETAILS
            # -------------------------------------------------

            expected_customers = details.expected_customers

            advance_bookings = details.advance_bookings

            total_customers += expected_customers


            # -------------------------------------------------
            # GET FOODS FOR THIS MEAL
            # -------------------------------------------------

            dishes = MEAL_MENU_ITEMS.get(
                slot_key,
                [],
            )

            predicted_items: List[
                PredictedFoodItem
            ] = []


            # -------------------------------------------------
            # BUILD ML INPUT ROWS
            # -------------------------------------------------

            feature_rows: List[
                Dict[str, Any]
            ] = []

            for dish in dishes:

                row = self.construct_prediction_row(

                    meal_slot=slot_key,

                    dish=dish,

                    expected_customers=expected_customers,

                    advance_bookings=advance_bookings,

                    conditions=request.conditions,
                )

                feature_rows.append(row)


            # -------------------------------------------------
            # CREATE DATAFRAME
            # -------------------------------------------------

            input_dataframe = pd.DataFrame(
                feature_rows
            )[EXACT_FEATURE_COLUMNS]


            # -------------------------------------------------
            # RUN TRAINED ML MODEL
            # -------------------------------------------------

            raw_predictions = self._model.predict(
                input_dataframe
            )


            # -------------------------------------------------
            # BUILD OUTPUT
            # -------------------------------------------------

            for dish, pred_val in zip(
                dishes,
                raw_predictions,
            ):

                recommended_qty = max(
                    1.0,
                    float(round(pred_val, 1)),
                )


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


            # -------------------------------------------------
            # ADD MEAL SECTION
            # -------------------------------------------------

            sections.append(

                MealSectionPrediction(

                    meal_slot=slot_key,

                    expected_customers=expected_customers,

                    advance_bookings=advance_bookings,

                    items=predicted_items,
                )
            )


        # -----------------------------------------------------
        # SUMMARY
        # -----------------------------------------------------

        summary = (
            f"Preparation plan generated for "
            f"{total_customers} expected customers."
        )


        # -----------------------------------------------------
        # FINAL RESPONSE
        # -----------------------------------------------------

        return PredictionResponse(

            success=True,

            summary=summary,

            total_customers=total_customers,

            date=request.conditions.date,

            model_loaded=True,

            model_source=str(self._model_path),

            sections=sections,
        )


# ---------------------------------------------------------
# SINGLETON INSTANCE
# ---------------------------------------------------------

predictor_instance = MealMindMLPredictor()