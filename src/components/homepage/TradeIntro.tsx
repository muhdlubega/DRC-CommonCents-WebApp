import '../../styles/main.scss';

const TradeIntro = () => {
  const handleRegisterClick = () => {
    console.log('Register button clicked!');
  };

  return (
    <div className="trade-info-container">
     <div className="trade-info-left">
        <img src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Trading Image" />
      </div>
      <div className="trade-info-right">
      <h2><b>Try out our Trading Stimulation</b></h2>
        <p>
          Welcome to our trading platform! Here you can explore the world of trading and seize exciting investment opportunities.
        </p>
        <button className="register-button" onClick={handleRegisterClick}>
          Trade Now
        </button>
      </div>
    </div>
  );
};

export default TradeIntro;

