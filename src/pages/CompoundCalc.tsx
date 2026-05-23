import { useState } from 'react';
import { calculateCompound } from '../hooks/useCalculations';
import { CompoundTable } from '../components/AmortTable';
import type { CompoundInput, CompoundResult } from '../types/calculators';

export default function CompoundCalc() {
  const [input, setInput] = useState<CompoundInput>({
    principal: 10000, monthlyContribution: 500, annualRate: 7,
    compoundFreq: 'monthly', years: 20,
  });
  const [result, setResult] = useState<CompoundResult | null>(null);
  const [showTable, setShowTable] = useState(false);

  const handleChange = (field: keyof CompoundInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.value;
      setInput({ ...input, [field]: field === 'compoundFreq' ? val : parseFloat(val) || 0 });
    };

  const handleCalc = () => { const r = calculateCompound(input); setResult(r); setShowTable(false); };

  return (
    <div className="page">
      <h1>📈 Compound Interest Calculator</h1>
      <p className="subtitle">See how your investments grow over time with compound interest.</p>

      <div className="calc-grid">
        <div className="calc-form">
          <div className="form-row">
            <label>Initial Investment ($)</label>
            <input type="number" value={input.principal} onChange={handleChange('principal')} />
          </div>
          <div className="form-row">
            <label>Monthly Contribution ($)</label>
            <input type="number" value={input.monthlyContribution} onChange={handleChange('monthlyContribution')} />
          </div>
          <div className="form-row">
            <label>Annual Interest Rate (%)</label>
            <input type="number" step="0.01" value={input.annualRate} onChange={handleChange('annualRate')} />
          </div>
          <div className="form-row">
            <label>Compound Frequency</label>
            <select value={input.compoundFreq} onChange={handleChange('compoundFreq')}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annually">Annually</option>
            </select>
          </div>
          <div className="form-row">
            <label>Years to Grow</label>
            <input type="number" value={input.years} onChange={handleChange('years')} />
          </div>
          <button className="btn btn-primary" onClick={handleCalc}>Calculate</button>
        </div>

        {result && (
          <div className="calc-results">
            <div className="result-card highlight">
              <div className="result-label">Final Balance</div>
              <div className="result-value">${result.finalBalance.toLocaleString()}</div>
            </div>
            <div className="result-row">
              <div className="result-card">
                <div className="result-label">Total Contributions</div>
                <div className="result-value small">${result.totalContributions.toLocaleString()}</div>
              </div>
              <div className="result-card">
                <div className="result-label">Total Interest Earned</div>
                <div className="result-value small">${result.totalInterest.toLocaleString()}</div>
              </div>
            </div>
            <div className="result-card">
              <div className="result-label">Return on Investment</div>
              <div className="result-value small">
                {((result.totalInterest / result.totalContributions) * 100).toFixed(1)}% gain
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowTable(!showTable)}>
              {showTable ? 'Hide' : 'Show'} Year-by-Year Table
            </button>
          </div>
        )}
      </div>

      {result && showTable && <CompoundTable rows={result.schedule} />}
    </div>
  );
}
