"""
Test script for Black-Scholes calculations

This script tests the Black-Scholes calculation function with various inputs
to verify correctness.
"""

from black_scholes import calculate_black_scholes


def test_basic_calculation():
    """Test basic Black-Scholes calculation"""
    print("Test 1: Basic Black-Scholes Calculation")
    print("-" * 50)
    
    S = 100  # Stock price
    K = 100  # Strike price
    T = 1.0  # Time to maturity (1 year)
    r = 0.05  # Risk-free rate (5%)
    sigma = 0.20  # Volatility (20%)
    q = 0.02  # Dividend yield (2%)
    
    call_price, put_price, d1, d2 = calculate_black_scholes(S, K, T, r, sigma, q)
    
    print(f"Stock Price: ${S}")
    print(f"Strike Price: ${K}")
    print(f"Time to Maturity: {T} years")
    print(f"Risk-Free Rate: {r*100}%")
    print(f"Volatility: {sigma*100}%")
    print(f"Dividend Yield: {q*100}%")
    print()
    print(f"Call Option Price: ${call_price:.4f}")
    print(f"Put Option Price: ${put_price:.4f}")
    print(f"d1: {d1:.4f}")
    print(f"d2: {d2:.4f}")
    print("\n")


def test_in_the_money():
    """Test in-the-money options"""
    print("Test 2: In-the-Money Options (S > K)")
    print("-" * 50)
    
    S = 110  # Stock price higher than strike
    K = 100
    T = 1.0
    r = 0.05
    sigma = 0.20
    q = 0.0
    
    call_price, put_price, d1, d2 = calculate_black_scholes(S, K, T, r, sigma, q)
    
    print(f"Stock Price: ${S} (In-the-money for call)")
    print(f"Strike Price: ${K}")
    print(f"Call Option Price: ${call_price:.4f}")
    print(f"Put Option Price: ${put_price:.4f}")
    print("\n")


def test_out_of_the_money():
    """Test out-of-the-money options"""
    print("Test 3: Out-of-the-Money Options (S < K)")
    print("-" * 50)
    
    S = 90  # Stock price lower than strike
    K = 100
    T = 1.0
    r = 0.05
    sigma = 0.20
    q = 0.0
    
    call_price, put_price, d1, d2 = calculate_black_scholes(S, K, T, r, sigma, q)
    
    print(f"Stock Price: ${S} (Out-of-the-money for call)")
    print(f"Strike Price: ${K}")
    print(f"Call Option Price: ${call_price:.4f}")
    print(f"Put Option Price: ${put_price:.4f}")
    print("\n")


def test_high_volatility():
    """Test with high volatility"""
    print("Test 4: High Volatility")
    print("-" * 50)
    
    S = 100
    K = 100
    T = 1.0
    r = 0.05
    sigma = 0.50  # 50% volatility
    q = 0.0
    
    call_price, put_price, d1, d2 = calculate_black_scholes(S, K, T, r, sigma, q)
    
    print(f"Volatility: {sigma*100}% (High)")
    print(f"Call Option Price: ${call_price:.4f}")
    print(f"Put Option Price: ${put_price:.4f}")
    print("\n")


def test_short_expiry():
    """Test with short time to expiry"""
    print("Test 5: Short Time to Expiry")
    print("-" * 50)
    
    S = 100
    K = 100
    T = 0.1  # About 36 days
    r = 0.05
    sigma = 0.20
    q = 0.0
    
    call_price, put_price, d1, d2 = calculate_black_scholes(S, K, T, r, sigma, q)
    
    print(f"Time to Maturity: {T} years (≈36 days)")
    print(f"Call Option Price: ${call_price:.4f}")
    print(f"Put Option Price: ${put_price:.4f}")
    print("\n")


def test_put_call_parity():
    """Test put-call parity relationship"""
    print("Test 6: Put-Call Parity Verification")
    print("-" * 50)
    
    S = 100
    K = 100
    T = 1.0
    r = 0.05
    sigma = 0.20
    q = 0.02
    
    call_price, put_price, d1, d2 = calculate_black_scholes(S, K, T, r, sigma, q)
    
    import math
    
    # Put-Call Parity: C - P = S*e^(-qT) - K*e^(-rT)
    left_side = call_price - put_price
    right_side = S * math.exp(-q * T) - K * math.exp(-r * T)
    
    print(f"Call Price: ${call_price:.4f}")
    print(f"Put Price: ${put_price:.4f}")
    print(f"Call - Put: ${left_side:.4f}")
    print(f"S*e^(-qT) - K*e^(-rT): ${right_side:.4f}")
    print(f"Difference: ${abs(left_side - right_side):.6f}")
    print(f"Put-Call Parity Holds: {abs(left_side - right_side) < 0.01}")
    print("\n")


if __name__ == "__main__":
    print("=" * 50)
    print("BLACK-SCHOLES CALCULATOR TEST SUITE")
    print("=" * 50)
    print("\n")
    
    test_basic_calculation()
    test_in_the_money()
    test_out_of_the_money()
    test_high_volatility()
    test_short_expiry()
    test_put_call_parity()
    
    print("=" * 50)
    print("All tests completed!")
    print("=" * 50)
