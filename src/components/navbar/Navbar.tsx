import { useNavigate } from "react-router-dom";
import "../../styles/main.scss";
import AuthModal from "../authentication/AuthModal";
import UserSidebar from "../authentication/UserSidebar";
// import { useGlobalState } from "../../store/Context";
import AuthStore from "../../store/AuthStore";
import { observer } from "mobx-react";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header-main">
      <div className="header-container">
        <nav className="header-nav">
          <h1 className="header-title" onClick={() => navigate("/")}>
            CommonCents
          </h1>
          <div className="header-nav">
            <div className="header-title" onClick={() => navigate("/trade/1HZ10V")}>Trade</div>
            <div className="header-title" onClick={() => navigate("/news")}>News</div>
            {/* <div className="header-title" onClick={() => navigate("/learn")}>Learn</div> */}
            <div className="header-title" onClick={() => navigate("/about")}>About</div>
            {AuthStore.user ? <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
              <div
  style={{
    width: "100%",
    fontSize: 24,
    textAlign: "center",
    padding: 8,
    margin: 5,
    backgroundColor: "white",
    borderRadius: 5
  }}
>
  {AuthStore.balance} USD
</div>
              <UserSidebar /></div> : <AuthModal />}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default observer(Header);
