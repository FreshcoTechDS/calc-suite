export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  interestRate: number; // annual %
  loanTerm: number;     // years
  propertyTax: number;  // annual
  homeInsurance: number; // annual
  pmi: number;          // annual
}

export interface AmortRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  totalInterest: number;
  balance: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortization: AmortRow[];
}

export interface CreditCardInput {
  balance: number;
  apr: number;           // annual %
  monthlyPayment: number;
  extraPayment: number;  // additional monthly
}

export interface CreditCardResult {
  monthsToPayoff: number;
  yearsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  payoffDate: string;
  amortization: AmortRow[];
}

export interface CompoundInput {
  principal: number;
  monthlyContribution: number;
  annualRate: number;    // %
  compoundFreq: 'monthly' | 'quarterly' | 'annually';
  years: number;
}

export interface CompoundRow {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface CompoundResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  schedule: CompoundRow[];
}
