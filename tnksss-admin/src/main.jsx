import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from './layouts/DashboardLayout';
import ManageDistricts from './pages/ManageDistricts';
import ManageContent from './pages/ManageContent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="manage-districts" replace />} />
          <Route path="manage-districts" element={<ManageDistricts />} />
          <Route path="manage-content" element={<ManageContent />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
