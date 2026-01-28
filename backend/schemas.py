from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CalculationInput(BaseModel):
    """
    Schema for Black-Scholes calculation input
    """
    stock_price: float = Field(..., gt=0, description="Current stock price (S)")
    strike_price: float = Field(..., gt=0, description="Strike price (K)")
    term: float = Field(..., gt=0, description="Term of the option in years (T)")
    risk_free_rate: float = Field(..., ge=0, description="Risk-free interest rate as decimal (r)")
    volatility: float = Field(..., gt=0, description="Volatility as decimal (σ)")
    dividend_yield: float = Field(..., ge=0, description="Dividend yield as decimal (q)")

    class Config:
        json_schema_extra = {
            "example": {
                "stock_price": 100.0,
                "strike_price": 100.0,
                "term": 1.0,
                "risk_free_rate": 0.05,
                "volatility": 0.20,
                "dividend_yield": 0.02
            }
        }


class CalculationResponse(BaseModel):
    """
    Schema for Black-Scholes calculation response
    """
    id: int
    stock_price: float
    strike_price: float
    term: float
    risk_free_rate: float
    volatility: float
    dividend_yield: float
    call_price: float
    put_price: float
    d1: float
    d2: float
    timestamp: datetime

    class Config:
        from_attributes = True
