import { useState } from 'react';
import { calculateCreditCard } from '../hooks/useCalculations';
import { AmortTable } from '../components/AmortTable';
import type { CreditCardInput, CreditCardResult } from '../types/calculators';

export default function CreditCardCalc() {
  const [input, setInput] = useState<CreditCardInput>({
    balance: 5000, apr: 22.99, monthlyPayment: 200, extraPayment: 0,
  });
  const [result, setResult] = useState<CreditCardResult | null>(null);
  const [showTable, setShowTable] = useState(false);

  const handleChange = (field: keyof CreditCardInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setInput({ ...input, [field]: parseFloat(e.target.value) || 0 });

  const handleCalc = () => {
    const r = calculateCreditCard(input);
    setResult(r);
    setShowTable(false);
  };

  return (
    <div className="page">
      <h1>💳 Credit Card Payoff Calculator</h1>
      <p className="subtitle">See how long it will take to pay off your credit card and how much interest you'll pay.</p>

      <div className="calc-grid">
        <div className="calc-form">
          <div className="form-row">
            <label>Current Balance ($)</label>
            <input type="number" value={input.balance} onChange={handleChange('balance')} />
          </div>
          <div className="form-row">
            <label>APR (%)</label>
            <input type="number" step="0.01" value={input.apr} onChange={handleChange('apr')} />
          </div>
          <div className="form-row">
            <label>Monthly Payment ($)</label>
            <input type="number" value={input.monthlyPayment} onChange={handleChange('monthlyPayment')} />
          </div>
          <div className="form-row">
            <label>Extra Monthly Payment ($)</label>
            <input type="number" value={input.extraPayment} onChange={handleChange('extraPayment')} />
          </div>
          <button className="btn btn-primary" onClick={handleCalc}>Calculate</button>
        </div>

        {result && (
          <div className="calc-results">
            {result.monthsToPayoff === -1 ? (
              <div className="result-card highlight danger">
                <div className="result-label">⚠️ Warning</div>
                <div className="result-value small">{result.payoffDate}</div>
                <p style={{fontSize:'0.85rem',marginTop:'0.5rem',color:'#fca5a5'}}>
                  Your payment doesn't cover the monthly interest. Increase your payment to make progress.
                </p>
              </div>
            ) : (
              <>
                <div className="result-card highlight">
                  <div className="result-label">Time to Pay Off</div>
                  <div className="result-value">{result.monthsToPayoff} months</div>
                  <div className="result-sub">{result.yearsToPayoff} years</div>
                </div>
                <div className="result-row">
                  <div className="result-card">
                    <div className="result-label">Payoff Date</div>
                    <div className="result-value small">{result.payoffDate}</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Total Interest</div>
                    <div className="result-value small">${result.totalInterest.toLocaleString()}</div>
                  </div>
                </div>
                <div className="result-card">
                  <div className="result-label">Total Amount Paid</div>
                  <div className="result-value small">${result.totalPaid.toLocaleString()}</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowTable(!showTable)}>
                  {showTable ? 'Hide' : 'Show'} Month-by-Month Breakdown
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {result && showTable && result.monthsToPayoff > 0 && <AmortTable rows={result.amortization} />}
    </div>
  );
}
