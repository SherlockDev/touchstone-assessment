import { useState, useEffect } from 'react';
import { calculateBlackScholes } from '../api';
import { CalculationInput, CalculationResponse } from '../types';
import './CalculatorForm.css';

interface CalculatorFormProps {
  onCalculationComplete: (result: CalculationResponse) => void;
  initialValues?: CalculationInput | null;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculationComplete, initialValues }) => {
  const [formData, setFormData] = useState<CalculationInput>({
    stock_price: 100,
    strike_price: 100,
    term: 1.0,
    risk_free_rate: 0.0500,
    volatility: 0.2000,
    dividend_yield: 0.0000,
  });

  // Track input mode for each field (true = percentage, false = decimal)
  const [inputModes, setInputModes] = useState({
    risk_free_rate: false,
    volatility: false,
    dividend_yield: false,
  });

  // Display values (shown in UI, may be percentages)
  const [displayValues, setDisplayValues] = useState({
    risk_free_rate: '0.05',
    volatility: '0.20',
    dividend_yield: '0.0',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
      setDisplayValues({
        risk_free_rate: initialValues.risk_free_rate.toFixed(4),
        volatility: initialValues.volatility.toFixed(4),
        dividend_yield: initialValues.dividend_yield.toFixed(4),
      });
    }
  }, [initialValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleRateInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'risk_free_rate' | 'volatility' | 'dividend_yield') => {
    const value = e.target.value;
    setDisplayValues(prev => ({
      ...prev,
      [fieldName]: value,
    }));

    // Convert to decimal for backend
    const numValue = parseFloat(value) || 0;
    const decimalValue = inputModes[fieldName] ? numValue / 100 : numValue;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: decimalValue,
    }));
  };

  const toggleInputMode = (fieldName: 'risk_free_rate' | 'volatility' | 'dividend_yield') => {
    const currentMode = inputModes[fieldName];
    const currentDecimalValue = formData[fieldName];

    // Toggle mode
    setInputModes(prev => ({
      ...prev,
      [fieldName]: !currentMode,
    }));

    // Convert display value
    if (!currentMode) {
      // Switching to percentage mode
      setDisplayValues(prev => ({
        ...prev,
        [fieldName]: (currentDecimalValue * 100).toFixed(2),
      }));
    } else {
      // Switching to decimal mode
      setDisplayValues(prev => ({
        ...prev,
        [fieldName]: currentDecimalValue.toFixed(4),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await calculateBlackScholes(formData);
      onCalculationComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculator-form-container">
      <h2>Input Parameters</h2>
      <form onSubmit={handleSubmit} className="calculator-form">
        <div className="form-group">
          <label htmlFor="stock_price">
            Stock Price
            <span className="tooltip">Current market price of the underlying stock</span>
          </label>
          <input
            type="number"
            id="stock_price"
            name="stock_price"
            value={formData.stock_price}
            onChange={handleInputChange}
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="strike_price">
            Strike Price
            <span className="tooltip">The agreed-upon price at which the option can be exercised</span>
          </label>
          <input
            type="number"
            id="strike_price"
            name="strike_price"
            value={formData.strike_price}
            onChange={handleInputChange}
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="term">
            Term (years)
            <span className="tooltip">Time until option expiration in years</span>
          </label>
          <input
            type="number"
            id="term"
            name="term"
            value={formData.term}
            onChange={handleInputChange}
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="risk_free_rate">
            Risk-Free Rate
            <span className="tooltip">{inputModes.risk_free_rate ? "Risk-free interest rate percentage" : "Risk-free interest rate eg 0.05 = 5%"}</span>
          </label>
          <div className="input-with-toggle">
            <input
              type="number"
              id="risk_free_rate"
              name="risk_free_rate"
              value={displayValues.risk_free_rate}
              onChange={(e) => handleRateInputChange(e, 'risk_free_rate')}
              step={inputModes.risk_free_rate ? "0.01" : "0.0001"}
              min="0"
              required
            />
            <button
              type="button"
              title="Toggle input mode"
              className="toggle-button"
              onClick={() => toggleInputMode('risk_free_rate')}
            >
              {inputModes.risk_free_rate ? '%' : 'Decimal'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="volatility">
            Volatility
            <span className="tooltip">{inputModes.volatility ? "Annualized Volatility percentage" : "Annualized Volatility eg 0.5 = 50%"}</span>
          </label>
          <div className="input-with-toggle">
            <input
              type="number"
              id="volatility"
              name="volatility"
              value={displayValues.volatility}
              onChange={(e) => handleRateInputChange(e, 'volatility')}
              step={inputModes.volatility ? "0.01" : "0.0001"}
              min="0.0001"
              required
            />
            <button
              type="button"
              title="Toggle input mode"
              className="toggle-button"
              onClick={() => toggleInputMode('volatility')}
            >
              {inputModes.volatility ? '%' : 'Decimal'}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dividend_yield">
            Dividend Yield
            <span className="tooltip">{inputModes.dividend_yield ? "Dividend yield percentage" : "Dividend yield eg 0.02 = 2%"}</span>
          </label>
          <div className="input-with-toggle">
            <input
              type="number"
              id="dividend_yield"
              name="dividend_yield"
              value={displayValues.dividend_yield}
              onChange={(e) => handleRateInputChange(e, 'dividend_yield')}
              step={inputModes.dividend_yield ? "0.01" : "0.0001"}
              min="0"
              required
            />
            <button
              type="button"
              title="Toggle input mode"
              className="toggle-button"
              onClick={() => toggleInputMode('dividend_yield')}
            >
              {inputModes.dividend_yield ? '%' : 'Decimal'}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="calculate-button" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate Option Prices'}
        </button>
      </form>
    </div>
  );
};

export default CalculatorForm;
