import { useState } from 'react';
import './App.css';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import HistoryTable from './components/HistoryTable';
import { CalculationResponse, CalculationInput } from './types';

function App() {
  const [currentResult, setCurrentResult] = useState<CalculationResponse | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const [initialFormData, setInitialFormData] = useState<CalculationInput | null>(null);

  const handleCalculationComplete = (result: CalculationResponse) => {
    setCurrentResult(result);
    setRefreshHistory(prev => prev + 1);
  };

  const handleHistoryUpdate = () => {
    setRefreshHistory(prev => prev + 1);
  };

  const handleLoadCalculation = (calculation: CalculationResponse) => {
    const formData: CalculationInput = {
      stock_price: calculation.stock_price,
      strike_price: calculation.strike_price,
      term: calculation.term,
      risk_free_rate: calculation.risk_free_rate,
      volatility: calculation.volatility,
      dividend_yield: calculation.dividend_yield,
    };
    setInitialFormData(formData);
    setCurrentResult(calculation);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Black-Scholes Options Pricing Calculator</h1>
        <p>Calculate theoretical prices for European-style options with dividend yields</p>
      </header>

      <div className="app-content">
        <div className="calculator-section">
          {currentResult && <ResultsDisplay result={currentResult} />}
          <CalculatorForm 
            onCalculationComplete={handleCalculationComplete}
            initialValues={initialFormData}
          />
        </div>

        <div className="history-section">
          <HistoryTable 
            refreshTrigger={refreshHistory}
            onHistoryUpdate={handleHistoryUpdate}
            onLoadCalculation={handleLoadCalculation}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
