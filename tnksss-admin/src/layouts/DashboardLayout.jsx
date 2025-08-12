import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, CssBaseline, Drawer, Toolbar, Typography, AppBar, IconButton, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItemButton component={Link} to="/admin/manage-districts">
            <ListItemText primary="District Master" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin/manage-content">
            <ListItemText primary="Manage Content" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px - 40px)',
        }}
      >
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: drawerWidth,
          right: 0,
          height: 40,
          bgcolor: 'background.paper',
          borderTop: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © 2025 Your Company
        </Typography>
      </Box>
    </Box>
  );
}
