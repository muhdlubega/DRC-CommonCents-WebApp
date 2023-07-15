import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./../firebase";
import { Box, Card, CardContent, Grid, Modal, Typography } from "@mui/material";
import authStore from "../store/AuthStore";
import { observer } from "mobx-react-lite";
import volatilityone from '../assets/images/market/1HZ10V.svg';
import volatilitytwo from '../assets/images/market/1HZ25V.svg';
import volatilitythree from '../assets/images/market/1HZ50V.svg';
import volatilityfour from '../assets/images/market/1HZ75V.svg';
import volatilityfive from '../assets/images/market/1HZ100V.svg';
import volatilitysix from '../assets/images/market/R_10.svg';
import volatilityseven from '../assets/images/market/R_25.svg';
import volatilityeight from '../assets/images/market/R_50.svg';
import volatilitynine from '../assets/images/market/R_75.svg';
import volatilityten from '../assets/images/market/R_100.svg';
import jumpone from '../assets/images/market/JD_10.svg';
import jumptwo from '../assets/images/market/JD_25.svg';
import jumpthree from '../assets/images/market/JD_50.svg';
import jumpfour from '../assets/images/market/JD_75.svg';
import jumpfive from '../assets/images/market/JD_100.svg';
import bear from '../assets/images/market/RDBEAR.svg';
import bull from '../assets/images/market/RDBULL.svg';
import { Clock } from "iconsax-react";

export interface Trade {
  strategy: string;
  status: string;
  marketType: string;
  basis: string;
  previousSpot: number;
  currentSpot: number;
  additionalAmount: number;
  payoutValue: number;
  askPrice: number;
  tickDuration: number;
  timestamp: number;
}

export const MarketSymbols: { [key: string]: string } = {
  '1HZ10V': volatilityone,
  '1HZ25V': volatilitytwo,
  '1HZ50V': volatilitythree,
  '1HZ75V': volatilityfour,
  '1HZ100V': volatilityfive,
  'R_10': volatilitysix,
  'R_25': volatilityseven,
  'R_50': volatilityeight,
  'R_75': volatilitynine,
  'R_100': volatilityten,
  'JD10': jumpone,
  'JD25': jumptwo,
  'JD50': jumpthree,
  'JD75': jumpfour,
  'JD100': jumpfive,
  'RDBEAR': bear,
  'RDBULL': bull
};
export const MarketName: { [key: string]: string } = {
  '1HZ10V': 'Volatility 10 (1s) Index',
  '1HZ25V': 'Volatility 25 (1s) Index',
  '1HZ50V': 'Volatility 50 (1s) Index',
  '1HZ75V': 'Volatility 75 (1s) Index',
  '1HZ100V': 'Volatility 100 (1s) Index',
  'R_10': 'Volatility 10 Index',
  'R_25': 'Volatility 25 Index',
  'R_50': 'Volatility 50 Index',
  'R_75': 'Volatility 75 Index',
  'R_100': 'Volatility 100 Index',
  'JD10': 'Jump 10 Index',
  'JD25': 'Jump 25 Index',
  'JD50': 'Jump 50 Index',
  'JD75': 'Jump 75 Index',
  'JD100': 'Jump 100 Index',
  'RDBEAR': 'Bear Market Index',
  'RDBULL': 'Bull Market Index'
};


const TradeHistoryPage = observer(() => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const handleCardClick = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const handleCloseModal = () => {
    setSelectedTrade(null);
  };  

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchTradeData = async () => {
      try {
        const tradeHistoryRef = collection(
          db,
          "users",
          auth.currentUser!.uid,
          "tradeHistory"
        );
        const snapshot = await getDocs(tradeHistoryRef);
        const data = snapshot.docs.map((doc) => doc.data() as Trade);
        setTradeData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTradeData();

    authStore.getUserNetWorth();
  }, []);  

  return (
    <Box>
      <Typography variant="h6" sx={{fontFamily: 'Roboto', 
    borderBottom: '1px solid #888', margin: '20px'}}>
        Trade History
      </Typography>
      {tradeData.filter((trade) => trade.status !== undefined).length > 0 ? (
        <Box>
    <Grid container spacing={2}>
      {tradeData.filter((trade) => trade.status !== undefined).sort((a, b) => b.timestamp - a.timestamp).map((trade, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card onClick={() => handleCardClick(trade)} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', height: '180px', border: '1px solid #000000', borderRadius: '10px'}}>
            <CardContent>
            <Box component="span" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <img
          src={MarketSymbols[trade.marketType]}
          alt={trade.marketType}
          style={{ width: '75px', height: '75px', margin: '10px' }}
        />
        <Box style={{margin: '0 10px'}}>
              <Typography variant="h5" style={{fontSize: '20px'}}>{MarketName[trade.marketType]}</Typography>
              <Typography variant="h6" sx={{color: trade.status === "Won" ? "green" : "red", fontSize: '16px'}}>Profit/Loss: {trade.status === "Won" ? trade.additionalAmount : `-${trade.askPrice}`} USD</Typography>
              <Typography style={{fontSize: '12px'}}>{formatTimestamp(trade.timestamp)}</Typography></Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    <Typography variant="h6" style={{fontFamily: 'Roboto', padding:'20px', display:'flex', flexDirection: 'column', justifyContent:'flex-end', alignItems: 'flex-end', borderTop: '1px solid #888', margin: '20px'}}>
          <span>Total Profit: {authStore.totalAmountWon.toFixed(2)} USD</span>
          <span>Total Loss: {authStore.totalAmountLost.toFixed(2)} USD</span>
          <span style={{color: '#0033ff'}}>Net Worth: {authStore.userNetWorth.toFixed(2)} USD</span>
        </Typography>
    <Modal
      open={selectedTrade !== null}
      onClose={handleCloseModal}
      aria-labelledby="trade-details-modal"
      aria-describedby="trade-details-modal-description"
    >
      <Card
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          borderRadius: '10px',
          border: 'none'
        }} className="trade-history-card"
      >
        {selectedTrade && (
            <CardContent>

        <div style={{backgroundColor: selectedTrade.status === "Won" ? "green" : "red", display: 'flex', justifyContent: 'center', width: '100%', padding: '16px'}}>
            <span style={{display: 'flex'}}><img
          src={MarketSymbols[selectedTrade.marketType]}
          alt={selectedTrade.marketType}
        />
              <Typography variant="h5" style={{color: 'white', marginLeft: '10px'}}>{selectedTrade.status}</Typography>
              </span></div>
              <Typography variant="h6" sx={{color: selectedTrade.status === "Won" ? "green" : "red", marginTop: '20px'}}>Profit/Loss: {selectedTrade.status === "Won" ? selectedTrade.additionalAmount : `-${selectedTrade.askPrice}`} USD</Typography>
              <Typography variant="body1"><strong>Market Type:</strong> {selectedTrade.marketType} - {MarketName[selectedTrade.marketType]}</Typography>
              <Typography variant="body1"><strong>Payout Limit:</strong> {selectedTrade.additionalAmount} USD</Typography>
              <Typography variant="body1"><strong>Buy Price:</strong> {selectedTrade.askPrice} USD</Typography>
              <Typography variant="body1"><strong>Previous Spot:</strong> {selectedTrade.previousSpot}</Typography>
              <Typography variant="body1"><strong>Current Spot:</strong> {selectedTrade.currentSpot}</Typography>
              <Typography variant="body1"><strong>Strategy:</strong> {selectedTrade.strategy}</Typography>
              <Typography variant="body1"><strong>Basis:</strong> {selectedTrade.basis}</Typography>
              <Typography variant="body1"><strong>Duration:</strong> {selectedTrade.tickDuration} Ticks</Typography>
              <Typography variant="body1" style={{fontSize: '12px'}}>{formatTimestamp(selectedTrade.timestamp)}</Typography>
            </CardContent>
        )}
      </Card>
    </Modal>
    </Box>
      ): (
      <Box style={{height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '60px'}}>
        <Clock size={280} color="grey"/>
        <Typography variant="h6" style={{margin: '15px'}}>No trade history available. Start trading now!</Typography>
        </Box>
      )}
      </Box>
  );
});

export default TradeHistoryPage;

