import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Drawer } from "@mui/material";
import AuthModal from "../authentication/AuthModal";
import UserSidebar from "../authentication/UserSidebar";
import AuthStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import logo from '../../assets/images/commoncents-logo.png';
// import { MoneyRecive, Book, Global, MessageQuestion } from "iconsax-react";
import { ArrowRight2, HambergerMenu, Moon } from "iconsax-react";
import { useState } from "react";
import themeStore from "../../store/ThemeStore";

const Header = observer(() => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, right: open });
    };


  return (
    <AppBar position="static" sx={{backgroundColor: "white", color: "black", width: "100%"}}>
      <Toolbar className="navbar-container">
        <img src={logo} className="navbar-logo" onClick={() => navigate("/")}></img>
        <Typography
          variant="h6"
          component="h1"
          onClick={() => navigate("/")}
          className="navbar-title"
        >
          CommonCents
        </Typography>
        <Box className="navbar-main">
        {/* <MoneyRecive color="#3366ff" size={26} style={{marginRight: '0.5vw', cursor: 'pointer'}} onClick={() => navigate("/trade/1HZ10V")}/> */}
          <Typography
            onClick={() => navigate("/trade/1HZ10V")}
            className="navbar-item"
          >
            Trade
          </Typography>
        {/* <Book color="#3366ff" size={26} style={{marginRight: '0.5vw', cursor: 'pointer'}} onClick={() => navigate("/news")}/> */}
          <Typography
            onClick={() => navigate("/news")}
            className="navbar-item"
          >
            News
          </Typography>
        {/* <Global color="#3366ff" size={26} style={{marginRight: '0.5vw', cursor: 'pointer'}} onClick={() => navigate("/forum")}/> */}
          <Typography
            onClick={() => navigate("/forum")}
            className="navbar-item"
          >
            Forum
          </Typography>
        {/* <MessageQuestion color="#3366ff" size={26} style={{marginRight: '0.5vw', cursor: 'pointer'}} onClick={() => navigate("/about")}/> */}
          <Typography
            onClick={() => navigate("/about")}
            className="navbar-item"
          >
            About
          </Typography>
          <Moon onClick={themeStore.toggleMode} style={{cursor: 'pointer'}} color="#3366ff" size={26} />
          <HambergerMenu className="hamberger-menu" color="#3366ff" size={26} onClick={toggleDrawer(true)}/> 
          {AuthStore.user ? (
              <UserSidebar />
          ) : (
            <AuthModal />
          )}
        </Box>
        <Drawer anchor="right" open={state.right} onClose={toggleDrawer(false)}>
        <Box className="sidebar-container">
        <h6 className="sidebar-item" onClick={() => navigate("/trade")}>Trade<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <h6 className="sidebar-item" onClick={() => navigate("/news")}>News<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <h6 className="sidebar-item" onClick={() => navigate("/forum")}>Forum<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <h6 className="sidebar-item" onClick={() => navigate("/about")}>About<ArrowRight2 size={16} style={{marginLeft: '0.5vw'}}/></h6>
          <div style={{flex: 1}}></div>
        </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
});

export default Header;
