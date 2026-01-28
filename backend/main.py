from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
from database import engine, get_db
from black_scholes import calculate_black_scholes

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Black-Scholes Calculator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Black-Scholes Calculator API"}


@app.post("/calculate", response_model=schemas.CalculationResponse)
def calculate(
    calculation_input: schemas.CalculationInput,
    db: Session = Depends(get_db)
):
    """
    Calculate Black-Scholes option prices and save to database
    """
    try:
        # Perform calculation
        call_price, put_price, d1, d2 = calculate_black_scholes(
            S=calculation_input.stock_price,
            K=calculation_input.strike_price,
            t=calculation_input.term,
            r=calculation_input.risk_free_rate,
            v=calculation_input.volatility,
            q=calculation_input.dividend_yield
        )
        
        # Save to database
        db_calculation = models.Calculation(
            stock_price=calculation_input.stock_price,
            strike_price=calculation_input.strike_price,
            term=calculation_input.term,
            risk_free_rate=calculation_input.risk_free_rate,
            volatility=calculation_input.volatility,
            dividend_yield=calculation_input.dividend_yield,
            call_price=call_price,
            put_price=put_price,
            d1=d1,
            d2=d2
        )
        
        db.add(db_calculation)
        db.commit()
        db.refresh(db_calculation)
        
        return schemas.CalculationResponse(
            id=db_calculation.id,
            stock_price=db_calculation.stock_price,
            strike_price=db_calculation.strike_price,
            term=db_calculation.term,
            risk_free_rate=db_calculation.risk_free_rate,
            volatility=db_calculation.volatility,
            dividend_yield=db_calculation.dividend_yield,
            call_price=db_calculation.call_price,
            put_price=db_calculation.put_price,
            d1=db_calculation.d1,
            d2=db_calculation.d2,
            timestamp=db_calculation.timestamp
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/history", response_model=List[schemas.CalculationResponse])
def get_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve calculation history from database
    """
    calculations = db.query(models.Calculation).order_by(
        models.Calculation.timestamp.desc()
    ).offset(skip).limit(limit).all()
    
    return calculations


@app.delete("/history/{calculation_id}")
def delete_calculation(calculation_id: int, db: Session = Depends(get_db)):
    """
    Delete a specific calculation from history
    """
    calculation = db.query(models.Calculation).filter(
        models.Calculation.id == calculation_id
    ).first()
    
    if not calculation:
        raise HTTPException(status_code=404, detail="Calculation not found")
    
    db.delete(calculation)
    db.commit()
    
    return {"message": "Calculation deleted successfully"}
