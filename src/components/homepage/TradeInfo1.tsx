import '../../styles/CSS/tradeinfo.css';

const TradeInfo1 = () => {
  const handleRegisterClick = () => {
    console.log('Register button clicked!');
  };

  return (
    <div className="trade-info-container">
      <div className="trade-info-left1">
        <img src="https://o.remove.bg/downloads/ffde9485-71cb-4efc-82f3-78ddd7b456b6/pexels-photo-6765247-removebg-preview.png" alt="Trading Image(Coin)" />
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

export default TradeInfo1;

