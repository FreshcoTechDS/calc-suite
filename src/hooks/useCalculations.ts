import type { MortgageInput, MortgageResult, CreditCardInput, CreditCardResult, CompoundInput, CompoundResult, AmortRow, CompoundRow } from '../types/calculators';

// ============================================================
// MORTGAGE CALCULATOR
// ============================================================
export function calculateMortgage(input: MortgageInput): MortgageResult {
  const { homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance, pmi } = input;
  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTerm * 12;

  let monthlyPI: number;
  if (monthlyRate === 0) {
    monthlyPI = loanAmount / totalMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths);
    monthlyPI = loanAmount * (monthlyRate * factor) / (factor - 1);
  }

  const monthlyTax = propertyTax / 12;
  const monthlyIns = homeInsurance / 12;
  const monthlyPMI = pmi / 12;
  const monthlyPayment = monthlyPI + monthlyTax + monthlyIns + monthlyPMI;

  // Amortization schedule (PI only — tax/ins/PMI don't affect balance)
  const amortization: AmortRow[] = [];
  let balance = loanAmount;
  let totalInterest = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPI - interest;
    totalInterest += interest;
    balance -= principal;
    if (balance < 0) balance = 0;

    amortization.push({
      month,
      payment: monthlyPI,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });

    if (balance <= 0.01) break;
  }

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(monthlyPayment * totalMonths * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    amortization,
  };
}

// ============================================================
// CREDIT CARD PAYOFF CALCULATOR
// ============================================================
export function calculateCreditCard(input: CreditCardInput): CreditCardResult {
  const { balance, apr, monthlyPayment, extraPayment } = input;
  const monthlyRate = apr / 100 / 12;
  const totalPayment = monthlyPayment + extraPayment;

  let remaining = balance;
  let totalInterest = 0;
  let month = 0;
  const amortization: AmortRow[] = [];

  while (remaining > 0 && month < 600) {
    month++;
    const interest = remaining * monthlyRate;
    let principal = totalPayment - interest;
    if (principal <= 0) {
      // Payment doesn't cover interest — add a flag row
      amortization.push({
        month,
        payment: totalPayment,
        principal: 0,
        interest: Math.round(interest * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        balance: Math.round(remaining * 100) / 100,
      });
      // If payment is too low to even cover interest, it'll never pay off
      if (totalPayment <= interest) {
        return {
          monthsToPayoff: -1,
          yearsToPayoff: -1,
          totalInterest: -1,
          totalPaid: -1,
          payoffDate: 'Never — payment too low',
          amortization,
        };
      }
      continue;
    }
    if (principal > remaining) principal = remaining;
    totalInterest += interest;
    remaining -= principal;

    amortization.push({
      month,
      payment: totalPayment,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      balance: Math.round(remaining * 100) / 100,
    });
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);

  return {
    monthsToPayoff: month,
    yearsToPayoff: Math.round((month / 12) * 10) / 10,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPaid: Math.round((balance + totalInterest) * 100) / 100,
    payoffDate: payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    amortization,
  };
}

// ============================================================
// COMPOUND INTEREST CALCULATOR
// ============================================================
export function calculateCompound(input: CompoundInput): CompoundResult {
  const { principal, monthlyContribution, annualRate, compoundFreq, years } = input;
  const rate = annualRate / 100;

  let compoundsPerYear = 12;
  if (compoundFreq === 'quarterly') compoundsPerYear = 4;
  if (compoundFreq === 'annually') compoundsPerYear = 1;

  const schedule: CompoundRow[] = [];
  let balance = principal;
  let totalContributions = principal;
  let totalInterest = 0;

  for (let year = 1; year <= years; year++) {
    const startBalance = balance;
    const yearlyContribution = monthlyContribution * 12;
    totalContributions += yearlyContribution;

    // Compound month by month with contributions
    for (let m = 0; m < 12; m++) {
      balance += monthlyContribution;
      const monthsPerCompound = 12 / compoundsPerYear;
      if ((m + 1) % monthsPerCompound === 0) {
        balance *= (1 + rate / compoundsPerYear);
      }
    }

    const yearlyInterest = balance - startBalance - yearlyContribution;
    totalInterest += yearlyInterest;

    schedule.push({
      year,
      balance: Math.round(balance * 100) / 100,
      contributions: Math.round(totalContributions * 100) / 100,
      interest: Math.round(yearlyInterest * 100) / 100,
    });
  }

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule,
  };
}
