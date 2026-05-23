import { useState } from 'react';
import { calculateAutoLoan } from '../hooks/useCalculations';
import { AmortTable } from '../components/AmortTable';
import type { AutoLoanInput, AutoLoanResult } from '../types/calculators';

export default function AutoLoanCalc() {
  const [input, setInput] = useState<AutoLoanInput>({
    vehiclePrice: 35000, downPayment: 5000, tradeInValue: 3000,
    interestRate: 6.5, loanTerm: 60, salesTaxRate: 7, titleFees: 250,
  });
  const [result, setResult] = useState<AutoLoanResult | null>(null);
  const [showTable, setShowTable] = useState(false);

  const handleChange = (field: keyof AutoLoanInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setInput({ ...input, [field]: parseFloat(e.target.value) || 0 });

  const handleCalc = () => {
    const r = calculateAutoLoan(input);
    setResult(r);
    setShowTable(false);
  };

  return (
    <div className="page">
      <h1>🚗 Auto Loan Calculator</h1>
      <p className="subtitle">Calculate your monthly car payment including sales tax and trade-in value.</p>

      <div className="calc-grid">
        <div className="calc-form">
          <div className="form-row">
            <label>Vehicle Price ($)</label>
            <input type="number" value={input.vehiclePrice} onChange={handleChange('vehiclePrice')} />
          </div>
          <div className="form-row">
            <label>Down Payment ($)</label>
            <input type="number" value={input.downPayment} onChange={handleChange('downPayment')} />
          </div>
          <div className="form-row">
            <label>Trade-In Value ($)</label>
            <input type="number" value={input.tradeInValue} onChange={handleChange('tradeInValue')} />
          </div>
          <div className="form-row">
            <label>Interest Rate (%)</label>
            <input type="number" step="0.01" value={input.interestRate} onChange={handleChange('interestRate')} />
          </div>
          <div className="form-row">
            <label>Loan Term (months)</label>
            <input type="number" value={input.loanTerm} onChange={handleChange('loanTerm')} />
          </div>
          <div className="form-row">
            <label>Sales Tax Rate (%)</label>
            <input type="number" step="0.01" value={input.salesTaxRate} onChange={handleChange('salesTaxRate')} />
          </div>
          <div className="form-row">
            <label>Title &amp; Registration Fees ($)</label>
            <input type="number" value={input.titleFees} onChange={handleChange('titleFees')} />
          </div>
          <button className="btn btn-primary" onClick={handleCalc}>Calculate</button>
        </div>

        {result && (
          <div className="calc-results">
            <div className="result-card highlight">
              <div className="result-label">Monthly Payment</div>
              <div className="result-value">${result.monthlyPayment.toFixed(2)}</div>
            </div>
            <div className="result-row">
              <div className="result-card">
                <div className="result-label">Loan Amount</div>
                <div className="result-value small">${result.loanAmount.toLocaleString()}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value small">${result.totalInterest.toLocaleString()}</div>
              </div>
            </div>
            <div className="result-row">
              <div className="result-card">
                <div className="result-label">Total Cost</div>
                <div className="result-value small">${result.totalPayment.toLocaleString()}</div>
              </div>
              <div className="result-card">
                <div className="result-label">{input.loanTerm} Payments of</div>
                <div className="result-value small">${result.monthlyPayment.toFixed(2)}</div>
              </div>
            </div>
            <div className="result-card">
              <div className="result-label">Sales Tax Included</div>
              <div className="result-value small">${((input.vehiclePrice * input.salesTaxRate) / 100).toLocaleString()}</div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowTable(!showTable)}>
              {showTable ? 'Hide' : 'Show'} Amortization Schedule
            </button>
          </div>
        )}
      </div>

      {result && showTable && <AmortTable rows={result.amortization} />}
    </div>
  );
}
