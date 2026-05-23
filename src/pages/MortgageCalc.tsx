import { useState } from 'react';
import { calculateMortgage } from '../hooks/useCalculations';
import { AmortTable } from '../components/AmortTable';
import type { MortgageInput, MortgageResult } from '../types/calculators';

export default function MortgageCalc() {
  const [input, setInput] = useState<MortgageInput>({
    homePrice: 300000, downPayment: 60000, interestRate: 6.5,
    loanTerm: 30, propertyTax: 2400, homeInsurance: 1200, pmi: 0,
  });
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [showTable, setShowTable] = useState(false);

  const handleChange = (field: keyof MortgageInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setInput({ ...input, [field]: parseFloat(e.target.value) || 0 });

  const handleCalc = () => {
    const r = calculateMortgage(input);
    setResult(r);
    setShowTable(false);
  };

  return (
    <div className="page">
      <h1>🏠 Mortgage Calculator</h1>
      <p className="subtitle">Estimate your monthly mortgage payment including taxes, insurance, and PMI.</p>

      <div className="calc-grid">
        <div className="calc-form">
          <div className="form-row">
            <label>Home Price ($)</label>
            <input type="number" value={input.homePrice} onChange={handleChange('homePrice')} />
          </div>
          <div className="form-row">
            <label>Down Payment ($)</label>
            <input type="number" value={input.downPayment} onChange={handleChange('downPayment')} />
          </div>
          <div className="form-row">
            <label>Interest Rate (%)</label>
            <input type="number" step="0.01" value={input.interestRate} onChange={handleChange('interestRate')} />
          </div>
          <div className="form-row">
            <label>Loan Term (years)</label>
            <input type="number" value={input.loanTerm} onChange={handleChange('loanTerm')} />
          </div>
          <div className="form-row">
            <label>Annual Property Tax ($)</label>
            <input type="number" value={input.propertyTax} onChange={handleChange('propertyTax')} />
          </div>
          <div className="form-row">
            <label>Annual Home Insurance ($)</label>
            <input type="number" value={input.homeInsurance} onChange={handleChange('homeInsurance')} />
          </div>
          <div className="form-row">
            <label>Annual PMI ($)</label>
            <input type="number" value={input.pmi} onChange={handleChange('pmi')} />
          </div>
          <button className="btn btn-primary" onClick={handleCalc}>Calculate</button>
        </div>

        {result && (
          <div className="calc-results">
            <div className="result-card highlight">
              <div className="result-label">Monthly Payment</div>
              <div className="result-value">${result.monthlyPayment.toLocaleString()}</div>
            </div>
            <div className="result-row">
              <div className="result-card">
                <div className="result-label">Principal + Interest</div>
                <div className="result-value small">${(result.monthlyPayment - 
                  ((input.propertyTax + input.homeInsurance + input.pmi) / 12)).toFixed(2)}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Tax, Ins, PMI</div>
                <div className="result-value small">${((input.propertyTax + input.homeInsurance + input.pmi) / 12).toFixed(2)}</div>
              </div>
            </div>
            <div className="result-row">
              <div className="result-card">
                <div className="result-label">Total of 360 Payments</div>
                <div className="result-value small">${result.totalPayment.toLocaleString()}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Interest</div>
                <div className="result-value small">${result.totalInterest.toLocaleString()}</div>
              </div>
            </div>
            <div className="result-card">
              <div className="result-label">Loan Amount</div>
              <div className="result-value small">${(input.homePrice - input.downPayment).toLocaleString()}</div>
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
