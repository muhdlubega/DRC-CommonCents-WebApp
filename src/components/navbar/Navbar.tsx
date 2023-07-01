import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import AuthModal from "../authentication/AuthModal";
import UserSidebar from "../authentication/UserSidebar";
import AuthStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import logo from '../../assets/images/commoncents-logo.png';
import { MoneyRecive, Book, Global, MessageQuestion } from "iconsax-react";

const Header = () => {
  const navigate = useNavigate();

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
        <MoneyRecive color="#3366ff" size={26} style={{marginRight: '0.5vw', cursor: 'pointer'}} onClick={() => navigate("/trade/1HZ10V")}/>
          <Typography
            onClick={() => navigate("/trade/1HZ10V")}
            className="navbar-title"
          >
            Trade
          </Typography>
        <Book color="#3366ff" size={26} style={{marginRight: '0.5vw', cursor: 'pointer'}} onClick={() => navigate("/news")}/>
          <Typography
            onClick={() => navigate("/news")}
            className="navbar-title"
          >
            News
          </Typography>
        <Global color="#3366ff" size={26} style={{marginRight: '0.5vw', cursor: 'pointer'}} onClick={() => navigate("/forum")}/>
          <Typography
            onClick={() => navigate("/forum")}
            className="navbar-title"
          >
            Forum
          </Typography>
        <MessageQuestion color="#3366ff" size={26} style={{marginRight: '0.5vw', cursor: 'pointer'}} onClick={() => navigate("/about")}/>
          <Typography
            onClick={() => navigate("/about")}
            className="navbar-title"
          >
            About
          </Typography>
          {AuthStore.user ? (
              <UserSidebar />
          ) : (
            <AuthModal />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default observer(Header);
