import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./../firebase";
import { Card, CardContent, Typography } from "@mui/material";

interface Trade {
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
}

const TradeHistoryPage = () => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);

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
  }, []);

  return (
    <div>
      {tradeData.map((trade, index) => (
        <div key={index}>
          <Card key={index}>
  <CardContent>
    <Typography variant="h4" sx={{color: trade.status === "Win" ? "green" : "red"}}>{trade.status}</Typography>
    <Typography variant="h6" sx={{color: trade.status === "Win" ? "green" : "red"}}>Profit/Loss: {trade.status === "Win" ? trade.additionalAmount : `-${trade.askPrice}`} USD</Typography>
    <Typography variant="body1">Previous Spot: {trade.previousSpot}</Typography>
    <Typography variant="body1">Current Spot: {trade.currentSpot}</Typography>
    <Typography variant="body1">Market Type: {trade.marketType}</Typography>
    <Typography variant="body1">Strategy: {trade.strategy}</Typography>
    <Typography variant="body1">Basis: {trade.basis}</Typography>
    <Typography variant="body1">Duration: {trade.tickDuration} Ticks</Typography>
    <Typography variant="body1">Buy Price: {trade.askPrice} USD</Typography>
    <Typography variant="body1">Payout Limit: {trade.additionalAmount} USD</Typography>
  </CardContent>
</Card>
        </div>
      ))}
    </div>
  );
};

export default TradeHistoryPage;

