import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Typography,
  Box,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AuthModal from "../authentication/AuthModal";
import UserSidebar from "../authentication/UserSidebar";
import AuthStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import logo from "../../assets/images/commoncents-logo.png";
import { Switch } from "@mui/material";
import { styled } from "@mui/system";
import { ArrowRight2, HambergerMenu } from "iconsax-react";
import { useState } from "react";
import themeStore, { themes } from "../../store/ThemeStore";
import "../../styles/components.scss";

const Header = observer(() => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, right: open });
  };

  const MaterialUISwitch = styled(Switch)(() => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(28px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: theme.palette.background.default,
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#0033ff",
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: "#D7D7D7",
      borderRadius: 20 / 2,
    },
  }));

  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  return (
    <AppBar
      position="static"
      className="navbar-container"
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box className="navbar-main">
        <img
          src={logo}
          className="navbar-logo"
          onClick={() => navigate("/")}
        ></img>
        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          className="navbar-title"
        >
          CommonCents
        </Typography>
        <Box sx={{ flex: 3 }}></Box>
        <Typography
          onClick={() => navigate("/trade/1HZ10V")}
          className="navbar-item"
        >
          Trade
        </Typography>
        <Typography onClick={() => navigate("/news")} className="navbar-item">
          News
        </Typography>
        <Typography onClick={() => navigate("/forum")} className="navbar-item">
          Forum
        </Typography>
        <Typography onClick={() => navigate("/about")} className="navbar-item">
          About
        </Typography>
        {isSmallScreen ? null : (
          <MaterialUISwitch
            className="navbar-switch"
            checked={themeStore.mode === themes.dark}
            onChange={themeStore.toggleMode}
            color="default"
          />
        )}
        <HambergerMenu
          className="hamberger-menu"
          color="#0033ff"
          size={26}
          onClick={toggleDrawer(true)}
        />
        {AuthStore.user ? <UserSidebar /> : <AuthModal />}
      </Box>
      <Drawer anchor="right" open={state.right} onClose={toggleDrawer(false)}>
        <Box className="sidebar-container">
          <MaterialUISwitch
            checked={themeStore.mode === themes.dark}
            onChange={themeStore.toggleMode}
            color="default"
          />
          <Typography
            className="sidebar-item"
            onClick={() => navigate("/trade/1HZ10V")}
          >
            Trade
            <ArrowRight2 size={16} style={{ marginLeft: "0.5vw" }} />
          </Typography>
          <Typography
            className="sidebar-item"
            onClick={() => navigate("/news")}
          >
            News
            <ArrowRight2 size={16} style={{ marginLeft: "0.5vw" }} />
          </Typography>
          <Typography
            className="sidebar-item"
            onClick={() => navigate("/forum")}
          >
            Forum
            <ArrowRight2 size={16} style={{ marginLeft: "0.5vw" }} />
          </Typography>
          <Typography
            className="sidebar-item"
            onClick={() => navigate("/about")}
          >
            About
            <ArrowRight2 size={16} style={{ marginLeft: "0.5vw" }} />
          </Typography>
          <Box style={{ flex: 1 }}></Box>
        </Box>
      </Drawer>
    </AppBar>
  );
});

export default Header;
