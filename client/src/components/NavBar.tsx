import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { useCart } from "../context/CartContext";
import logo from "../assets/design/לוגו-על-אפיקי-מים.jpg";

const NavBar = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = [
    { label: "דף הבית", path: "/" },
    { label: "על השיטה", path: "/method" },
    { label: "חנות", path: "/products" },
    { label: "משחקים", path: "/games" },
    { label: "המלצות", path: "/testimonials" },
    { label: "בלוג", path: "/blog" },
    { label: "אודות", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{ bgcolor: "white", color: "text.primary" }}
    >
      <Toolbar sx={{ gap: 0.5 }}>
        {/* המבורגר ראשון בDOM → ימין קיצוני ב-RTL */}
        {isMobile && (
          <>
            <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              SlideProps={{ direction: "left" }}
            >
              <Box sx={{ width: 220, pt: 2, direction: "rtl" }}>
                <List>
                  {links.map((link) => (
                    <ListItemButton
                      key={link.path}
                      component={Link}
                      to={link.path}
                      selected={isActive(link.path)}
                      onClick={() => setDrawerOpen(false)}
                      sx={{ justifyContent: "flex-start" }}
                    >
                      <ListItemText
                        primary={link.label}
                        sx={{ textAlign: "right" }}
                      />
                    </ListItemButton>
                  ))}
                  <ListItemButton
                    component={Link}
                    to="/cart"
                    onClick={() => setDrawerOpen(false)}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <ListItemText
                      primary={`סל קניות (${totalItems})`}
                      sx={{ textAlign: "right" }}
                    />
                  </ListItemButton>
                </List>
              </Box>
            </Drawer>
          </>
        )}

        <Box
          component={Link}
          to="/"
          sx={{
            flexGrow: isMobile ? 1 : 0,
            display: "flex",
            alignItems: "center",
            mr: 0.5,
            ml: { xs: 0.5, md: 3 },
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="על אפיקי מים"
            sx={{ height: { xs: 36, md: 44 }, width: "auto", display: "block" }}
          />
        </Box>

        {isMobile ? (
          <IconButton component={Link} to="/cart" color="inherit">
            <Badge badgeContent={totalItems || undefined} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        ) : (
          <>
            {links.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  color: isActive(link.path) ? "primary.main" : "text.primary",
                  fontWeight: isActive(link.path) ? 700 : 500,
                  borderBottom: isActive(link.path)
                    ? "2px solid"
                    : "2px solid transparent",
                  borderRadius: 0,
                  px: 1.5,
                  pb: 0.5,
                  minWidth: 'auto',
                }}
              >
                {link.label}
              </Button>
            ))}
            <Box sx={{ flexGrow: 1 }} />
            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={totalItems || undefined} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;