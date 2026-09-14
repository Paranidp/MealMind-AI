"""
Pydantic Schemas for MealMind AI FastAPI Backend
Defines strict request and response validation for planning inputs and model predictions.
"""

from typing import Dict, List, Optional
from enum import Enum
from pydantic import BaseModel, Field, field_validator


class WeatherEnum(str, Enum):
    NORMAL = "Normal"
    HOT = "Hot"
    RAINY = "Rainy"
    CLOUDY = "Cloudy"


class MealDetailInput(BaseModel):
    expected_customers: int = Field(
        ...,
        gt=0,
        description="Total anticipated customer headcount for this meal service (must be > 0)"
    )
    advance_bookings: int = Field(
        default=0,
        ge=0,
        description="Confirmed reservation count for this meal service"
    )

    @field_validator("advance_bookings")
    @classmethod
    def validate_bookings(cls, v: int, info) -> int:
        expected = info.data.get("expected_customers")
        if expected is not None and v > expected:
            raise ValueError("advance_bookings cannot exceed expected_customers")
        return v


class CommonConditionsInput(BaseModel):
    date: str = Field(..., description="Preparation service date in YYYY-MM-DD format")
    is_holiday: bool = Field(default=False, description="Whether the date is a declared public holiday")
    holiday_name: Optional[str] = Field(default=None, description="Name of the holiday if is_holiday=True")
    is_festival: bool = Field(default=False, description="Whether a festival coincides with this date")
    festival_name: Optional[str] = Field(default=None, description="Name of the festival if is_festival=True")
    festival_type: Optional[str] = Field(default=None, description="Festival category (e.g. Cultural, Religious)")
    special_event: Optional[str] = Field(default="None", description="Special event hosted (Banquet, VIP, Conference)")
    weather: WeatherEnum = Field(
        default=WeatherEnum.NORMAL,
        description="Operating weather (strictly one of: Normal, Hot, Rainy, Cloudy)"
    )
    special_offer: bool = Field(default=False, description="Whether an active promotional offer or discount is running")


class PlanningRequest(BaseModel):
    selected_meals: List[str] = Field(
        ...,
        min_length=1,
        max_length=3,
        description="List of selected meal slots: 'breakfast', 'lunch', 'dinner'"
    )
    meal_details: Dict[str, MealDetailInput] = Field(
        ...,
        description="Dictionary mapping each selected meal slot to its headcount parameters"
    )
    conditions: CommonConditionsInput = Field(
        ...,
        description="Common day conditions and operating surge factors"
    )

    @field_validator("selected_meals")
    @classmethod
    def validate_meal_slots(cls, meals: List[str]) -> List[str]:
        valid_slots = {"breakfast", "lunch", "dinner"}
        for m in meals:
            if m.lower() not in valid_slots:
                raise ValueError(f"Invalid meal slot '{m}'. Must be one of {valid_slots}")
        return [m.lower() for m in meals]


class PredictedFoodItem(BaseModel):
    """
    Official MealMind AI Output:
    Food Item | Recommended Quantity | Unit
    """
    food_item: str = Field(..., description="Food item name (e.g. Dosa, Biryani)")
    food_item_ta: Optional[str] = Field(default=None, description="Tamil translation of the food item")
    recommended_quantity: float = Field(..., description="Recommended quantity predicted by the ML model")
    unit: str = Field(..., description="Measurement unit (Pieces, Portions, kg, Litres, Sets)")
    unit_ta: Optional[str] = Field(default=None, description="Tamil unit representation")
    category: Optional[str] = Field(default=None, description="Culinary category")


class MealSectionPrediction(BaseModel):
    meal_slot: str
    expected_customers: int
    advance_bookings: int
    items: List[PredictedFoodItem]


class PredictionResponse(BaseModel):
    success: bool
    summary: str = Field(..., description="Plan summary message")
    total_customers: int = Field(..., description="Total aggregate customer headcount")
    date: str
    model_loaded: bool = Field(..., description="Indicates whether mealmind_model.pkl was loaded")
    model_source: str = Field(..., description="Model provenance or file status")
    sections: List[MealSectionPrediction]
    error: Optional[str] = None


class ModelStatusResponse(BaseModel):
    status: str
    model_found: bool
    model_path: str
    model_type: Optional[str] = None
    expected_features: List[str]
    description: str
