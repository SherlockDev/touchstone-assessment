import { CalculationResponse } from '../types';
import './ResultsDisplay.css';

interface ResultsDisplayProps {
  result: CalculationResponse;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const formatValue = (value: number, decimals: number = 4): string => {
    return value.toFixed(decimals);
  };

  const formatPercent = (value: number): string => {
    return (value * 100).toFixed(2) + '%';
  };

  return (
    <div className="results-container">
      <h2>Calculation Results</h2>
      
      <div className="results-grid">
        <div className="result-card call">
          <div className="result-header">
            <h3>Call Option Price</h3>
          </div>
          <div className="result-value">
            ${formatValue(result.call_price, 3)}
          </div>
          <p className="result-description">
            Right to buy at strike price
          </p>
        </div>

        <div className="result-card put">
          <div className="result-header">
            <h3>Put Option Price</h3>
          </div>
          <div className="result-value">
            ${formatValue(result.put_price, 3)}
          </div>
          <p className="result-description">
            Right to sell at strike price
          </p>
        </div>
      </div>

      <div className="parameters-section">
        <h3>Input Parameters</h3>
        <div className="parameters-grid">
          <div className="parameter-item">
            <span className="parameter-label">Stock Price</span>
            <span className="parameter-value">${formatValue(result.stock_price, 2)}</span>
          </div>
          <div className="parameter-item">
            <span className="parameter-label">Strike Price</span>
            <span className="parameter-value">${formatValue(result.strike_price, 2)}</span>
          </div>
          <div className="parameter-item">
            <span className="parameter-label">Term</span>
            <span className="parameter-value">{formatValue(result.term, 2)} {result.term === 1 ? 'year' : 'years'}</span>
          </div>
          <div className="parameter-item">
            <span className="parameter-label">Risk-Free Rate</span>
            <span className="parameter-value">{formatPercent(result.risk_free_rate)}</span>
          </div>
          <div className="parameter-item">
            <span className="parameter-label">Volatility</span>
            <span className="parameter-value">{formatPercent(result.volatility)}</span>
          </div>
          <div className="parameter-item">
            <span className="parameter-label">Dividend Yield</span>
            <span className="parameter-value">{formatPercent(result.dividend_yield)}</span>
          </div>
        </div>
      </div>

      <div className="details-section">
        <h3>Calculation Details</h3>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">d₁</span>
            <span className="detail-value">{formatValue(result.d1)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">d₂</span>
            <span className="detail-value">{formatValue(result.d2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
