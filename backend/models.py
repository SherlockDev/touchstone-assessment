from sqlalchemy import Column, Integer, Float, DateTime
from sqlalchemy.sql import func
from database import Base


class Calculation(Base):
    """
    Database model for storing Black-Scholes calculations
    """
    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, index=True)
    
    # Input parameters
    stock_price = Column(Float, nullable=False)
    strike_price = Column(Float, nullable=False)
    term = Column(Float, nullable=False)
    risk_free_rate = Column(Float, nullable=False)
    volatility = Column(Float, nullable=False)
    dividend_yield = Column(Float, nullable=False, default=0.0)
    
    # Calculated results
    call_price = Column(Float, nullable=False)
    put_price = Column(Float, nullable=False)
    d1 = Column(Float, nullable=False)
    d2 = Column(Float, nullable=False)
    
    # Metadata
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Calculation(id={self.id}, call_price={self.call_price}, put_price={self.put_price})>"
