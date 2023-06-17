import { useNavigate } from "react-router-dom";
import "../../styles/main.scss";
import AuthModal from "../authentication/AuthModal";
import UserSidebar from "../authentication/UserSidebar";
// import { useGlobalState } from "../../store/Context";
import globalStore from "../../store/AuthStore";
import { observer } from "mobx-react";

const Header = () => {
  const navigate = useNavigate();
  const { 
    // currency, setCurrency, 
    user } = globalStore;

  return (
    <header className="header-main">
      <div className="header-container">
        <nav className="header-nav">
          <h1 className="header-title" onClick={() => navigate("/")}>
            CommonCents
          </h1>
          <div className="header-nav">
            <div className="header-title" onClick={() => navigate("/trade/1HZ10V")}>Trade</div>
            <div className="header-title" onClick={() => navigate("/")}>News</div>
            <div className="header-title" onClick={() => navigate("/")}>Forum</div>
            <div className="header-title" onClick={() => navigate("/")}>About</div>
            {/* <AuthModal/> */}
            {/* <AuthDetails/> */}
            {user ? <UserSidebar /> : <AuthModal />}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default observer(Header);
