import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import MortgageCalc from './pages/MortgageCalc';
import CreditCardCalc from './pages/CreditCardCalc';
import CompoundCalc from './pages/CompoundCalc';
import AutoLoanCalc from './pages/AutoLoanCalc';

export default function App() {
  return (
    <BrowserRouter basename="/calc-suite">
      <Nav />
      <main className="main">
        <Routes>
          <Route path="/" element={<MortgageCalc />} />
          <Route path="/credit-card" element={<CreditCardCalc />} />
          <Route path="/compound" element={<CompoundCalc />} />
          <Route path="/auto-loan" element={<AutoLoanCalc />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
