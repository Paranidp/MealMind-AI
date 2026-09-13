"""
MealMind AI FastAPI Application Entry Point
Exposes prediction API endpoints for integration with the React/TypeScript frontend.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from schemas import (
    PlanningRequest,
    PredictionResponse,
    ModelStatusResponse,
)
from predictor import (
    predictor_instance,
    ModelNotFoundError,
    EXPECTED_FEATURE_COLUMNS,
    MODEL_SEARCH_PATHS,
)

app = FastAPI(
    title="MealMind AI ML Prediction Service",
    description="Dedicated Python backend service hosting the scikit-learn RandomForestRegressor food demand model.",
    version="1.0.0",
)

# Enable CORS for communication with frontend dev server and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    """Confirms FastAPI service is operational."""
    return {
        "status": "online",
        "service": "MealMind AI Python Backend",
        "version": "1.0.0",
    }


@app.get("/api/model-status", response_model=ModelStatusResponse)
def get_model_status():
    """
    Checks if `mealmind_model.pkl` is loaded or pending placement.
    Does NOT fabricate mock values.
    """
    is_loaded, path, model_type = predictor_instance.get_model_status()
    if is_loaded:
        return ModelStatusResponse(
            status="ready",
            model_found=True,
            model_path=path,
            model_type=model_type,
            expected_features=EXPECTED_FEATURE_COLUMNS,
            description="Trained scikit-learn RandomForestRegressor model loaded successfully.",
        )
    return ModelStatusResponse(
        status="waiting_for_model",
        model_found=False,
        model_path=str(MODEL_SEARCH_PATHS[0]),
        model_type=None,
        expected_features=EXPECTED_FEATURE_COLUMNS,
        description=(
            "Model file 'mealmind_model.pkl' has not been placed yet. "
            "Please copy your trained scikit-learn model file to the backend directory."
        ),
    )


@app.post(
    "/api/predict",
    response_model=PredictionResponse,
    responses={
        503: {
            "description": "Model file mealmind_model.pkl missing",
        }
    },
)
def predict_preparation_plan(request: PlanningRequest):
    """
    Receives planning inputs, constructs the feature matrix, and queries
    the scikit-learn RandomForestRegressor model.
    """
    try:
        response = predictor_instance.predict_plan(request)
        return response
    except ModelNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "MODEL_FILE_NOT_FOUND",
                "message": str(e),
                "model_loaded": False,
                "expected_file": "mealmind_model.pkl",
                "expected_features": EXPECTED_FEATURE_COLUMNS,
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "INFERENCE_FAILED",
                "message": str(e),
            },
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
