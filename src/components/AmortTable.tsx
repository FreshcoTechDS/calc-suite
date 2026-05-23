import { useState } from 'react';
import type { AmortRow, CompoundRow } from '../types/calculators';

// Shared component for both mortgage/credit-card amortization and compound schedules
export function AmortTable({ rows, type = 'amort' }: { rows: AmortRow[]; type?: 'amort' }) {
  const [showAll, setShowAll] = useState(false);
  const displayRows = showAll ? rows : rows.slice(0, 24);

  return (
    <div className="amort-section">
      <h3>{type === 'amort' ? 'Amortization Schedule' : 'Payment Breakdown'}</h3>
      <div className="table-wrap">
        <table className="amort-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Payment</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Total Interest</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((r) => (
              <tr key={r.month} className={r.month % 12 === 0 ? 'year-end' : ''}>
                <td>{r.month}</td>
                <td>${r.payment.toFixed(2)}</td>
                <td>${'principal' in r ? r.principal.toFixed(2) : '—'}</td>
                <td>${r.interest.toFixed(2)}</td>
                <td>${r.totalInterest.toFixed(2)}</td>
                <td>${r.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 24 && (
        <button className="btn btn-outline" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : `Show All ${rows.length} Months`}
        </button>
      )}
    </div>
  );
}

export function CompoundTable({ rows }: { rows: CompoundRow[] }) {
  return (
    <div className="amort-section">
      <h3>Year-by-Year Growth</h3>
      <div className="table-wrap">
        <table className="amort-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Balance</th>
              <th>Contributions</th>
              <th>Interest Earned</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year}>
                <td>{r.year}</td>
                <td>${r.balance.toLocaleString()}</td>
                <td>${r.contributions.toLocaleString()}</td>
                <td>${r.interest.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
