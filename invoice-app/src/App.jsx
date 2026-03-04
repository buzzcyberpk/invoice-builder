import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InvoiceEditor from './pages/InvoiceEditor';
import Clients from './pages/Clients';
import NewClient from './pages/NewClient';

import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="invoice/new" element={<InvoiceEditor />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<NewClient />} />
          <Route path="settings" element={<Settings />} />
          {/* Fallback route */}
          <Route path="*" element={<div>Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
