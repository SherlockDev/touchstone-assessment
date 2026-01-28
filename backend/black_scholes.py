"""
Black-Scholes Option Pricing Model with Dividend Yield

The Black-Scholes model calculates the theoretical price of European-style options.
This implementation includes support for dividend yields.

Formulas:
---------
d1 = [ln(S/K) + (r - q + σ²/2)T] / (σ√T)
d2 = d1 - σ√T

Call Price = S * e^(-qT) * N(d1) - K * e^(-rT) * N(d2)
Put Price = K * e^(-rT) * N(-d2) - S * e^(-qT) * N(-d1)

Where:
- S: Current stock price
- K: Strike price
- t: Time to maturity (in years)
- r: Risk-free interest rate (as decimal)
- v: Volatility (as decimal)
- q: Dividend yield (as decimal)
- N(): Cumulative distribution function of standard normal distribution
"""

import math


def norm_cdf(x: float) -> float:
    """
    Cumulative distribution function for the standard normal distribution.
    Uses the approximation from Abramowitz and Stegun (1964).
    Accurate to about 7 decimal places.
    
    Parameters:
    -----------
    x : float
        Value at which to evaluate the CDF
    
    Returns:
    --------
    float
        Probability that a standard normal random variable is <= x
    """
    # Constants for the approximation
    a1 = 0.254829592
    a2 = -0.284496736
    a3 = 1.421413741
    a4 = -1.453152027
    a5 = 1.061405429
    p = 0.3275911
    
    # Save the sign of x
    sign = 1 if x >= 0 else -1
    x = abs(x) / math.sqrt(2.0)
    
    # A&S formula 7.1.26
    t = 1.0 / (1.0 + p * x)
    y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * math.exp(-x * x)
    
    return 0.5 * (1.0 + sign * y)


def calculate_black_scholes(
    S: float,
    K: float,
    t: float,
    r: float,
    v: float,
    q: float
) -> tuple[float, float, float, float]:
    """
    Calculate Black-Scholes option prices for both call and put options.
    
    Parameters:
    -----------
    S : float
        Current stock price
    K : float
        Strike price
    t : float
        Time to maturity (in years)
    r : float
        Risk-free interest rate (as decimal, e.g., 0.05 for 5%)
    v : float
        Volatility (as decimal, e.g., 0.20 for 20%)
    q : float
        Dividend yield (as decimal, e.g., 0.02 for 2%)
    
    Returns:
    --------
    tuple[float, float, float, float]
        (call_price, put_price, d1, d2)
    
    Raises:
    -------
    ValueError
        If any input parameter is invalid
    """
    # Input validation
    if S <= 0:
        raise ValueError("Stock price must be positive")
    if K <= 0:
        raise ValueError("Strike price must be positive")
    if t <= 0:
        raise ValueError("Time to maturity must be positive")
    if v <= 0:
        raise ValueError("Volatility must be positive")
    if r < 0:
        raise ValueError("Risk-free rate must be positive")
    if q < 0:
        raise ValueError("Dividend yield must be positive")
    
    # Calculate d1 and d2 using explicit formulas
    d1 = (math.log(S / K) + (r - q + (v ** 2 / 2)) * t) / (v * math.sqrt(t))
    d2 = (math.log(S / K) + (r - q - (v ** 2 / 2)) * t) / (v * math.sqrt(t))
    
    # Calculate call and put prices using cumulative normal distribution
    call_price = (S * math.exp(-q * t) * norm_cdf(d1) - 
                  K * math.exp(-r * t) * norm_cdf(d2))
    
    put_price = (K * math.exp(-r * t) * norm_cdf(-d2) - 
                 S * math.exp(-q * t) * norm_cdf(-d1))
    
    return call_price, put_price, d1, d2

