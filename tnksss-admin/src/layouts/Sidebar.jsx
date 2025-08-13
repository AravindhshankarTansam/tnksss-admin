import React, { useState, useEffect } from "react";
import { Drawer, Toolbar, List, ListItemButton, ListItemText, Divider, Collapse } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useLocation } from "react-router-dom";
import pagesConfig from "../config/pagesConfig.jsx";

const drawerWidth = 240;

export default function Sidebar() {
  const [openContentMenu, setOpenContentMenu] = useState(false);
  const location = useLocation();

  // Automatically open dropdown if current route is under /admin/content
  useEffect(() => {
    if (location.pathname.startsWith("/admin/content")) {
      setOpenContentMenu(true);
    }
  }, [location.pathname]);

  const isContentActive = location.pathname.startsWith("/admin/content");

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" }
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton
          component={Link}
          to="/admin/manage-districts"
          selected={location.pathname === "/admin/manage-districts"}
        >
          <ListItemText primary="District Master" />
        </ListItemButton>

        <ListItemButton
          onClick={() => setOpenContentMenu(!openContentMenu)}
          selected={isContentActive} // highlight when any content page is active
        >
          <ListItemText primary="Manage Content" />
          {openContentMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openContentMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {pagesConfig.map((page) => (
              <ListItemButton
                key={page.value}
                component={Link}
                to={page.route}
                sx={{ pl: 4 }}
                selected={location.pathname === page.route}
              >
                <ListItemText primary={page.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
}
