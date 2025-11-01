import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AccountingSettings } from './features/accounting/AccountingSettings';
import { Terms } from './features/terms/Terms';
import { RateUs } from './features/rate/RateUs';
import { HelpSupport } from './features/help/HelpSupport';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> 
        <Route index element={<Navigate to="/accounting" replace />} />
        <Route path="accounting" element={<AccountingSettings />} />
        <Route path="terms" element={<Terms />} />
        <Route path="rate" element={<RateUs />} />
        <Route path="help" element={<HelpSupport />} />
        <Route path="*" element={<Navigate to="/accounting" replace />} />
      </Route>
    </Routes>
  );
}

