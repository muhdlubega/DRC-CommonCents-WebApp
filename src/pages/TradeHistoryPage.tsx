import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./../firebase";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import authStore from "../store/AuthStore";
import { observer } from "mobx-react-lite";

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


const TradeHistoryPage = observer(() => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  // const [tradeSummary, setTradeSummary] = useState<Summary | null>(null);

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


    // const fetchTradeSummary = async () => {
    //   try {
    //     const tradeSummaryRef = doc(db, "users", auth.currentUser!.uid, "tradeHistory", "tradeSummary");
    //     const snapshot = await getDoc(tradeSummaryRef);
    // const data = snapshot.data() as Summary;
    // setTradeSummary(data);
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };

    // fetchTradeSummary();
  }, []);

  console.log(authStore.totalAmountLost, authStore.userNetWorth);
  

  return (
    <Box>
      <Typography variant="h4">
        Trade Summary
      </Typography>
      {/* {tradeSummary && ( */}
        <Typography variant="h5">
          Total Profit: {authStore.totalAmountWon.toFixed(2)} USD
          <br />
          Total Loss: {authStore.totalAmountLost.toFixed(2)} USD
          <br />
          <span style={{color: 'gold', fontSize: '120%'}}>Net Worth: {authStore.userNetWorth.toFixed(2)} USD</span>
        </Typography>
      {/* )} */}
    <Grid container spacing={2}>
      {tradeData.filter((trade) => trade.status !== undefined).map((trade, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{color: trade.status === "Win" ? "green" : "red"}}>{trade.status}</Typography>
              <Typography variant="h6" sx={{color: trade.status === "Win" ? "green" : "red"}}>Profit/Loss: {trade.status === "Win" ? trade.additionalAmount : `-${trade.askPrice}`} USD</Typography>
              <Typography variant="body1">Previous Spot: {trade.previousSpot}</Typography>
              <Typography variant="body1">Current Spot: {trade.currentSpot}</Typography>
              <Typography variant="body1">Market Type: {trade.marketType}</Typography>
              <Typography variant="body1">Strategy: {trade.strategy}</Typography>
              <Typography variant="body1">Basis: {trade.basis}</Typography>
              <Typography variant="body1">Duration: {trade.tickDuration} Ticks</Typography>
              <Typography variant="body1">Buy Price: {trade.askPrice} USD</Typography>
              <Typography variant="body1">Payout Limit: {trade.additionalAmount} USD</Typography>
              <Typography variant="body1">{formatTimestamp(trade.timestamp)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid></Box>
  );
});

export default TradeHistoryPage;

