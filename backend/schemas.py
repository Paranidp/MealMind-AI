"""
MealMind AI Predictor & Scikit-Learn Pipeline Model Loader

Loads the trained scikit-learn Pipeline from mealmind_model.pkl
and performs ML inference using the exact 14 features used during training.
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


# =========================================================
# MODEL PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_SEARCH_PATHS = [
    BASE_DIR / "mealmind_model.pkl",
    BASE_DIR / "models" / "mealmind_model.pkl",
    Path.cwd() / "mealmind_model.pkl",
]


# =========================================================
# EXACT FEATURES USED DURING MODEL TRAINING
# =========================================================

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


# =========================================================
# VALID WEATHER VALUES
# =========================================================

VALID_WEATHER_VALUES = {
    "Normal",
    "Hot",
    "Rainy",
    "Cloudy",
}


# =========================================================
# MODEL ERROR
# =========================================================

class ModelNotFoundError(Exception):
    """Raised when mealmind_model.pkl cannot be located."""
    pass


# =========================================================
# ML PREDICTOR
# =========================================================

class MealMindMLPredictor:

    def __init__(self):

        self._model: Optional[Any] = None
        self._model_path: Optional[Path] = None

        self._attempt_load()


    # =====================================================
    # FIND MODEL FILE
    # =====================================================

    def _find_model_file(self) -> Optional[Path]:

        for path in MODEL_SEARCH_PATHS:

            if path.exists() and path.is_file():
                return path

        return None


    # =====================================================
    # LOAD MODEL
    # =====================================================

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
                    f"[MealMind ML] Error loading model from {path}: {e}"
                )

                self._model = None

        return False


    # =====================================================
    # CHECK MODEL
    # =====================================================

    def is_model_loaded(self) -> bool:

        if self._model is not None:
            return True

        return self._attempt_load()


    # =====================================================
    # MODEL STATUS
    # =====================================================

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


    # =====================================================
    # CONSTRUCT ONE ML INPUT ROW
    # =====================================================

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

        advance_bookings_value = int(advance_bookings)


        # -------------------------------------------------
        # HOLIDAY
        # -------------------------------------------------

        is_holiday_value = (
            1
            if conditions.is_holiday
            else 0
        )

        holiday_name_value = (
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

        festival_name_value = (
            conditions.festival_name.strip()
            if (
                conditions.is_festival
                and conditions.festival_name
            )
            else "None"
        )

        festival_type_value = (
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

        special_event_value = (
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

        weather_value = (
            weather_clean
            if weather_clean in VALID_WEATHER_VALUES
            else "Normal"
        )


        # -------------------------------------------------
        # SPECIAL OFFER
        # -------------------------------------------------

        special_offer_value = (
            1
            if conditions.special_offer
            else 0
        )


        # -------------------------------------------------
        # EXACT 14 MODEL FEATURES
        # -------------------------------------------------

        return {

            "Day_of_Week": day_of_week,

            "Day_Type": day_type,

            "Month": month,

            "Meal": meal,

            "Food_Item": food_item,

            "Customers": customers,

            "Advance_Bookings": advance_bookings_value,

            "Is_Holiday": is_holiday_value,

            "Holiday_Name": holiday_name_value,

            "Festival_Name": festival_name_value,

            "Festival_Type": festival_type_value,

            "Special_Event": special_event_value,

            "Weather": weather_value,

            "Special_Offer": special_offer_value,
        }


    # =====================================================
    # PREDICT COMPLETE MEAL PLAN
    # =====================================================

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

            # -------------------------------------------------
            # NORMALIZE MEAL NAME
            # -------------------------------------------------

            slot_key = meal_slot.lower()


            # -------------------------------------------------
            # FIND MEAL DETAILS
            #
            # Works with:
            # "Breakfast"
            # "breakfast"
            # "BREAKFAST"
            # -------------------------------------------------

            details = next(
                (
                    value
                    for key, value
                    in request.meal_details.items()
                    if key.lower() == slot_key
                ),
                None,
            )


            # -------------------------------------------------
            # IF DETAILS ARE MISSING
            # -------------------------------------------------

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
            # RUN TRAINED MODEL
            # -------------------------------------------------

            raw_predictions = self._model.predict(
                input_dataframe
            )


            # -------------------------------------------------
            # BUILD PREDICTION OUTPUT
            # -------------------------------------------------

            for dish, prediction in zip(
                dishes,
                raw_predictions,
            ):

                recommended_quantity = max(
                    1.0,
                    float(round(prediction, 1)),
                )


                predicted_items.append(

                    PredictedFoodItem(

                        food_item=dish["name_en"],

                        food_item_ta=dish["name_ta"],

                        recommended_quantity=recommended_quantity,

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


        # =====================================================
        # SUMMARY
        # =====================================================

        summary = (
            f"Preparation plan generated for "
            f"{total_customers} expected customers."
        )


        # =====================================================
        # FINAL RESPONSE
        # =====================================================

        return PredictionResponse(

            success=True,

            summary=summary,

            total_customers=total_customers,

            date=request.conditions.date,

            model_loaded=True,

            model_source=str(self._model_path),

            sections=sections,

        )


# =========================================================
# SINGLETON PREDICTOR INSTANCE
# =========================================================

predictor_instance = MealMindMLPredictor()