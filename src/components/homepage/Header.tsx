import '../../styles/main.scss';
import bitcoin from '../../assets/bitcoin.gif'

const Header = () => {
  const handleRegisterClick = () => {
    console.log('Register button clicked!');
  };

  return (
    <div className="trade-info-container">
      <div className="trade-info-left1">
        <img src={bitcoin} alt="Trading Image(Coin)" />
      </div>
    
      <div className="trade-info-right">
        <p>
          Welcome to our trading platform! Here you can explore the world of trading and seize exciting investment opportunities.
        </p>
        <button className="register-button1" onClick={handleRegisterClick}>
          Trade Now
        </button>
      </div>
    </div>
  );
};

export default Header;

