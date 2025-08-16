import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";

export default function Header({ onMenuClick }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#ffececff", // light background
        color: "black",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left - Image instead of MenuIcon */}
        <IconButton edge="start" onClick={onMenuClick}>
          <Box
            component="img"
            src="/logo.png" // your image path
            alt="Menu"
            sx={{ height: 50, width: 50 }}
          />
        </IconButton>

        {/* Center - TNKSSS */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontWeight: "bold",
          }}
        >
          TNKSSS
        </Typography>

        {/* Right - Admin Dashboard */}
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Admin Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
