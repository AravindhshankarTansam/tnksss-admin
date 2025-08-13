import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import ManageDistricts from "./pages/ManageDistricts";
import DynamicHome from "./dropdownpages/DynamicHome";
import DynamicAboutus from "./dropdownpages/DynamicAboutus";
import DynamicGallery from "./dropdownpages/DynamicGallery";
import DynamicContact from "./dropdownpages/DynamicContact";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="manage-districts" replace />} />
          <Route path="manage-districts" element={<ManageDistricts />} />
          <Route path="content/home" element={<DynamicHome />} />
          <Route path="content/about" element={<DynamicAboutus />} />
          <Route path="content/gallery" element={<DynamicGallery />} />
          <Route path="content/contact" element={<DynamicContact />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}
