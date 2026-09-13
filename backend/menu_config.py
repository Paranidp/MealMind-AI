"""
MealMind AI Menu Configuration
Defines the official dish items, measurement units, and categories for each meal slot.
These are automatically mapped when a manager selects meal services.
"""

from typing import Dict, List, TypedDict

class DishMetadata(TypedDict):
    id: str
    name_en: str
    name_ta: str
    unit: str
    unit_ta: str
    category: str

# Meal items mapped strictly to user specifications
MEAL_MENU_ITEMS: Dict[str, List[DishMetadata]] = {
    "breakfast": [
        {
            "id": "bf_dosa",
            "name_en": "Dosa",
            "name_ta": "தோசை",
            "unit": "Pieces",
            "unit_ta": "துண்டுகள்",
            "category": "Tiffin / Griddle"
        },
        {
            "id": "bf_idli",
            "name_en": "Idli",
            "name_ta": "இட்லி",
            "unit": "Pieces",
            "unit_ta": "துண்டுகள்",
            "category": "Steamed Tiffin"
        },
        {
            "id": "bf_chapati",
            "name_en": "Chapati",
            "name_ta": "சப்பாத்தி",
            "unit": "Pieces",
            "unit_ta": "துண்டுகள்",
            "category": "Breads"
        },
        {
            "id": "bf_poori",
            "name_en": "Poori",
            "name_ta": "பூரி",
            "unit": "Pieces",
            "unit_ta": "துண்டுகள்",
            "category": "Fried Breads"
        }
    ],
    "lunch": [
        {
            "id": "lu_biryani",
            "name_en": "Biryani",
            "name_ta": "பிரியாணி",
            "unit": "plates",
            "unit_ta": "பங்குகள்",
            "category": "Special Rice"
        },
        {
            "id": "lu_rice",
            "name_en": "Rice",
            "name_ta": "சாதம்",
            "unit": "kg",
            "unit_ta": "கிலோ",
            "category": "Staple Grain"
        },
        {
            "id": "lu_sambar",
            "name_en": "Sambar",
            "name_ta": "சாம்பார்",
            "unit": "L",
            "unit_ta": "லிட்டர்",
            "category": "Lentil Gravy"
        },
        {
            "id": "lu_parotta",
            "name_en": "Parotta",
            "name_ta": "பரோட்டா",
            "unit": "Pieces",
            "unit_ta": "துண்டுகள்",
            "category": "Layered Bread"
        },
        {
            "id": "lu_meals",
            "name_en": "Meals",
            "name_ta": "மீல்ஸ்",
            "unit": "plates",
            "unit_ta": "செட்கள்",
            "category": "Full Thali"
        },
        {
            "id": "lu_chicken",
            "name_en": "Chicken",
            "name_ta": "சிக்கன்",
            "unit": "kg",
            "unit_ta": "கிலோ",
            "category": "Protein / Non-Veg"
        }
    ],
    "dinner": [
        {
            "id": "di_idli",
            "name_en": "Idli",
            "name_ta": "இட்லி",
            "unit": "Pieces",
            "unit_ta": "துண்டுகள்",
            "category": "Steamed Tiffin"
        },
        {
            "id": "di_dosa",
            "name_en": "Dosa",
            "name_ta": "தோசை",
            "unit": "Pieces",
            "unit_ta": "துண்டுகள்",
            "category": "Tiffin / Griddle"
        },
        {
            "id": "di_parotta",
            "name_en": "Parotta",
            "name_ta": "பரோட்டா",
            "unit": "Pieces",
            "unit_ta": "துண்டுகள்",
            "category": "Layered Bread"
        }
    ]
}
