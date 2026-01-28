export interface CalculationInput {
  stock_price: number;
  strike_price: number;
  term: number;
  risk_free_rate: number;
  volatility: number;
  dividend_yield: number;
}

export interface CalculationResponse {
  id: number;
  stock_price: number;
  strike_price: number;
  term: number;
  risk_free_rate: number;
  volatility: number;
  dividend_yield: number;
  call_price: number;
  put_price: number;
  d1: number;
  d2: number;
  timestamp: string;
}
