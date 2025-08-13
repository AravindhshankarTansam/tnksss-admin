import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header onMenuClick={handleDrawerToggle} />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "64px" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
