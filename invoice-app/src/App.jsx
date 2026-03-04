import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InvoiceEditor from './pages/InvoiceEditor';
import Clients from './pages/Clients';
import NewClient from './pages/NewClient';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="invoice/new" element={<InvoiceEditor />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/new" element={<NewClient />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
