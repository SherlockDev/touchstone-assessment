import { useState, useEffect } from 'react';
import { getCalculationHistory, deleteCalculation } from '../api';
import { CalculationResponse } from '../types';
import './HistoryTable.css';

interface HistoryTableProps {
  refreshTrigger: number;
  onHistoryUpdate: () => void;
  onLoadCalculation: (calculation: CalculationResponse) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ refreshTrigger, onHistoryUpdate, onLoadCalculation }) => {
  const [history, setHistory] = useState<CalculationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCalculationHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this calculation?')) {
      return;
    }

    try {
      await deleteCalculation(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      onHistoryUpdate();
    } catch (err) {
      alert('Failed to delete calculation');
    }
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatValue = (value: number, decimals: number = 2): string => {
    return value.toFixed(decimals);
  };

  // const formatPercent = (value: number): string => {
  //   return (value * 100).toFixed(2) + '%';
  // };

  if (loading) {
    return (
      <div className="history-container">
        <h2>Calculation History</h2>
        <div className="loading">Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <h2>Calculation History</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Calculation History</h2>
        <span className="history-count">{history.length} calculations</span>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No calculations yet. Start by calculating your first option price!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Stock Price</th>
                <th>Strike Price</th>
                <th>Term (Years)</th>
                <th>Call Price</th>
                <th>Put Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="timestamp">{formatDateTime(item.timestamp)}</td>
                  <td>${formatValue(item.stock_price)}</td>
                  <td>${formatValue(item.strike_price)}</td>
                  <td>{formatValue(item.term)}</td>
                  <td className="call-price">${formatValue(item.call_price)}</td>
                  <td className="put-price">${formatValue(item.put_price)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="load-button"
                        onClick={() => onLoadCalculation(item)}
                        title="Load this calculation"
                      >
                        📝
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(item.id)}
                        title="Delete calculation"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
