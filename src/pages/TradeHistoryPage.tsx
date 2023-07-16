import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./../firebase";
import { Box, Card, CardContent, Grid, Modal, Typography } from "@mui/material";
import authStore from "../store/AuthStore";
import { observer } from "mobx-react-lite";
import { Clock } from "iconsax-react";
import { MarketName, MarketSymbols } from "../arrays/MarketArray";

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
        authStore.setAlert({
          open: true,
          message: "Unable to fetch trade history currently. Try again later",
          type: "error",
        });
      }
    };

    fetchTradeData();
    authStore.getUserNetWorth();
  }, []);

  return (
    <Box>
      <Typography variant="h6" className="account-title">
        Trade History
      </Typography>
      {tradeData.filter((trade) => trade.status !== undefined).length > 0 ? (
        <Box>
          <Grid container spacing={2}>
            {tradeData
              .filter((trade) => trade.status !== undefined)
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((trade, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    onClick={() => handleCardClick(trade)}
                    className="trade-main-card"
                  >
                    <CardContent>
                      <Box component="span" className="trade-main-box">
                        <img
                          src={MarketSymbols[trade.marketType]}
                          alt={trade.marketType}
                          className="trade-main-img"
                        />
                        <Box className="trade-main-txt">
                          <Typography variant="h5" style={{ fontSize: "20px" }}>
                            {MarketName[trade.marketType]}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: trade.status === "Won" ? "green" : "red",
                              fontSize: "16px",
                            }}
                          >
                            Profit/Loss:{" "}
                            {trade.status === "Won"
                              ? trade.additionalAmount
                              : `-${trade.askPrice}`}{" "}
                            USD
                          </Typography>
                          <Typography style={{ fontSize: "12px" }}>
                            {formatTimestamp(trade.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>

          <Typography variant="h6" className="trade-summary">
            <span>Total Profit: {authStore.totalAmountWon.toFixed(2)} USD</span>
            <span>Total Loss: {authStore.totalAmountLost.toFixed(2)} USD</span>
            <span style={{ color: "#0033ff" }}>
              Net Worth: {authStore.userNetWorth.toFixed(2)} USD
            </span>
          </Typography>
          <Modal
            open={selectedTrade !== null}
            onClose={handleCloseModal}
            aria-labelledby="trade-details-modal"
            aria-describedby="trade-details-modal-description"
          >
            <Card className="trade-history-card">
              {selectedTrade && (
                <CardContent>
                  <Box
                    className="trade-history-box"
                    style={{
                      backgroundColor:
                        selectedTrade.status === "Won" ? "green" : "red",
                    }}
                  >
                    <span style={{ display: "flex" }}>
                      <img
                        src={MarketSymbols[selectedTrade.marketType]}
                        alt={selectedTrade.marketType}
                      />
                      <Typography
                        variant="h5"
                        style={{ color: "white", marginLeft: "10px" }}
                      >
                        {selectedTrade.status}
                      </Typography>
                    </span>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: selectedTrade.status === "Won" ? "green" : "red",
                      marginTop: "20px",
                    }}
                  >
                    Profit/Loss:{" "}
                    {selectedTrade.status === "Won"
                      ? selectedTrade.additionalAmount
                      : `-${selectedTrade.askPrice}`}{" "}
                    USD
                  </Typography>
                  <Typography variant="body1">
                    <strong>Market Type:</strong> {selectedTrade.marketType} -{" "}
                    {MarketName[selectedTrade.marketType]}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Payout Limit:</strong>{" "}
                    {selectedTrade.additionalAmount} USD
                  </Typography>
                  <Typography variant="body1">
                    <strong>Buy Price:</strong> {selectedTrade.askPrice} USD
                  </Typography>
                  <Typography variant="body1">
                    <strong>Previous Spot:</strong> {selectedTrade.previousSpot}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Current Spot:</strong> {selectedTrade.currentSpot}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Strategy:</strong> {selectedTrade.strategy}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Basis:</strong> {selectedTrade.basis}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Duration:</strong> {selectedTrade.tickDuration}{" "}
                    Ticks
                  </Typography>
                  <Typography variant="body1" style={{ fontSize: "12px" }}>
                    {formatTimestamp(selectedTrade.timestamp)}
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Modal>
        </Box>
      ) : (
        <Box className="trade-history-empty">
          <Clock size={280} color="grey" />
          <Typography variant="h6" style={{ margin: "15px" }}>
            No trade history available. Start trading now!
          </Typography>
        </Box>
      )}
    </Box>
  );
});

export default TradeHistoryPage;
