import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import AuthModal from "../authentication/AuthModal";
import UserSidebar from "../authentication/UserSidebar";
import AuthStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import logo from '../../assets/images/commoncents-logo.png';

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{backgroundColor: "white", color: "black"}}>
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
          <Typography
            onClick={() => navigate("/trade/1HZ10V")}
            className="navbar-title"
          >
            Trade
          </Typography>
          <Typography
            onClick={() => navigate("/news")}
            className="navbar-title"
          >
            News
          </Typography>
          <Typography
            onClick={() => navigate("/learn")}
            className="navbar-title"
          >
            Forum
          </Typography>
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
