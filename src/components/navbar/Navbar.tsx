import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import AuthModal from "../authentication/AuthModal";
import UserSidebar from "../authentication/UserSidebar";
import AuthStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" className="header-main" sx={{backgroundColor: 'black'}}>
      <Toolbar className="header-container">
        <Typography
          variant="h6"
          component="h1"
          onClick={() => navigate("/")}
          className="header-title"
        >
          CommonCents
        </Typography>
        <Box className="header-nav">
          <Button
            onClick={() => navigate("/trade/1HZ10V")}
            className="header-title"
          >
            Trade
          </Button>
          <Button
            onClick={() => navigate("/news")}
            className="header-title"
          >
            News
          </Button>
          {/* <Button
            onClick={() => navigate("/learn")}
            className="header-title"
          >
            Learn
          </Button> */}
          <Button
            onClick={() => navigate("/about")}
            className="header-title"
          >
            About
          </Button>
          {AuthStore.user ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  fontSize: 24,
                  textAlign: "center",
                  padding: 2,
                  margin: 1,
                  borderRadius: 5,
                }}
              >
                {AuthStore.balance?.toFixed(2)} USD
              </Box>
              <UserSidebar />
            </Box>
          ) : (
            <AuthModal />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default observer(Header);
