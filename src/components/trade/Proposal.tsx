import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/main.scss";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Box, Button, Card, Fab, Modal, Slider, TextField, Typography, useTheme } from "@mui/material";
import apiStore from "../../store/ApiStore";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import { auth, db } from "../../firebase";
import proposalStore from "../../store/ProposalStore";
import AuthStore from "../../store/AuthStore";
import { MoneySend } from "iconsax-react";
import { NorthEast, SouthEast } from "@mui/icons-material";
import { MarketSymbols } from "../../pages/TradeHistoryPage";

const Proposal = observer(() => {
  const { id } = useParams<{ id: string }>();
  const proposalContainerRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSecondQuoteModalOpen, setIsSecondQuoteModalOpen] = useState(false);  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleFabClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const theme = useTheme();
  const navigate = useNavigate();
  const openQuoteModal = () => {
    proposalStore.setContractType("CALL");
    setIsQuoteModalOpen(true);
  };
  
  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };
  
  const openSecondQuoteModal = () => {
    proposalStore.setContractType("PUT");
    setIsSecondQuoteModalOpen(true);
  };
  
  const closeSecondQuoteModal = () => {
    setIsSecondQuoteModalOpen(false);
  };
  

  const handleDurationChange = (_event: Event, value: number | number[]) => {
    const newDuration = value as number;
    proposalStore.setDuration(newDuration);
  };
  
  const handlePayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPayout = parseFloat(event.target.value);
    proposalStore.setPayout(newPayout);
  };

  const tickDuration = proposalStore.duration;
  const basis = proposalStore.basis;
  const marketType = apiStore.selectedSymbol;
  var timestamp = 0;

  const handleBuy = async (isHigher: boolean) => {
    setIsProcessing(true);
    let balance = 0;
    try {
      const balanceSnapshot = await getDocs(collection(db, "users"));
      balanceSnapshot.forEach((doc) => {
        if (auth.currentUser!.uid == doc.id) {
          balance = doc.data().balance || null;
        }
      });

      timestamp = Date.now();

      proposalStore.setContractType(isHigher ? "CALL" : "PUT");

      const currentBalance = balance;

      const payoutValue = parseFloat(proposalStore.payout.toString());
      const askPrice =
        proposalStore.proposalData[proposalStore.proposalData.length - 1]
          .ask_price;
      console.log(askPrice);

      console.log(payoutValue);
      console.log(currentBalance);

      if (currentBalance < payoutValue) {
        console.log("Insufficient balance");
        return;
      }

      let newBalance = 0;
      if (basis === "payout") {
        newBalance = currentBalance - askPrice;
      } else {
        newBalance = currentBalance - payoutValue;
      }
      authStore.setBalance(newBalance);

      setTimeout(() => handleSell(isHigher), tickDuration * 1000);

      authStore.setAlert({
        open: true,
        message: `Option successfully bought for USD ${
          basis === "payout" ? askPrice : payoutValue
        }`,
        type: "success",
      });

      console.log("Buy successful");
    } catch (error) {
      console.error("Error:", error);
      authStore.setAlert({
        open: true,
        message: `Error. Try again later`,
        type: "error",
      });
      setIsProcessing(false);
    }
  };

  authStore.getUserNetWorth();

  const handleSell = async (isHigher: boolean) => {
    setIsProcessing(true);
    let balance = 0;
    var status = null;

    const balanceSnapshot = await getDocs(collection(db, "users"));
    balanceSnapshot.forEach((doc) => {
      if (auth.currentUser!.uid == doc.id) {
        balance = doc.data().balance || null;
      }
    });

    proposalStore.setContractType(isHigher ? "CALL" : "PUT");

    const currentBalance = balance;

    const payoutValue = parseFloat(proposalStore.payout.toString());
    const askPrice =
      proposalStore.proposalData[proposalStore.proposalData.length - 1]
        .ask_price;

    console.log("payout/stake", payoutValue);
    console.log("balance", currentBalance);

    console.log("voice of no return", apiStore.proposalTicks);

    const previousSpot = apiStore.isTicks
      ? apiStore.proposalTicks[apiStore.proposalTicks.length - tickDuration - 1]
          .quote
      : apiStore.proposalTicks[apiStore.proposalTicks.length - tickDuration - 1]
          .close;
    const currentSpot = apiStore.isTicks
      ? apiStore.proposalTicks[apiStore.proposalTicks.length - 1].quote
      : apiStore.proposalTicks[apiStore.proposalTicks.length - 1].close;

    console.log("prev", previousSpot);
    console.log("next", currentSpot);

    const additionalAmount =
      proposalStore.proposalData[proposalStore.proposalData.length - 1].payout;

    const strategy = isHigher ? "Higher" : "Lower";

    try {
      if (previousSpot && currentSpot) {
        const previousSpotValue = previousSpot;
        const currentSpotValue = currentSpot;

        if (isHigher) {
          if (currentSpotValue > previousSpotValue) {
            const updatedBalance = currentBalance + additionalAmount;
            authStore.setBalance(updatedBalance);
            console.log("Spot is higher!!!", additionalAmount);
            authStore.setAlert({
              open: true,
              message: `Spot is higher! You won USD ${additionalAmount}!`,
              type: "success",
            });
            status = "Won";
            apiStore.setSellSuccessful(true);
            apiStore.setAdditionalAmount(additionalAmount);
            apiStore.setDeductedAmount(0);
            authStore.setTotalAmountWon(
              authStore.totalAmountWon + additionalAmount
            );
          } else {
            console.log("Spot is not higher", additionalAmount);
            authStore.setAlert({
              open: true,
              message: `Spot is not higher. You lost USD ${askPrice} :(`,
              type: "error",
            });
            status = "Lost";
            apiStore.setSellFailed(true);
            apiStore.setDeductedAmount(askPrice);
            apiStore.setAdditionalAmount(0);
            authStore.setTotalAmountLost(authStore.totalAmountLost + askPrice);
          }
        } else {
          if (previousSpotValue > currentSpotValue) {
            const updatedBalance = currentBalance + additionalAmount;
            authStore.setBalance(updatedBalance);
            console.log("Spot is lower!!!", additionalAmount);
            authStore.setAlert({
              open: true,
              message: `Spot is lower! You won USD ${additionalAmount}!`,
              type: "success",
            });
            status = "Won";
            apiStore.setSellSuccessful(true);
            apiStore.setAdditionalAmount(additionalAmount);
            apiStore.setDeductedAmount(0);
            authStore.setTotalAmountWon(
              authStore.totalAmountWon + additionalAmount
            );
          } else {
            console.log("Spot is not lower", additionalAmount);
            authStore.setAlert({
              open: true,
              message: `Spot is not lower. You lost USD ${askPrice} :(`,
              type: "error",
            });
            status = "Lost";
            apiStore.setSellFailed(true);
            apiStore.setDeductedAmount(askPrice);
            apiStore.setAdditionalAmount(0);
            authStore.setTotalAmountLost(authStore.totalAmountLost + askPrice);
          }
        }
      } else {
        console.log("Previous spot or current spot is not available");
        authStore.setAlert({
          open: true,
          message: `Error. Try again later`,
          type: "error",
        });
        const updatedBalance = currentBalance + payoutValue;
        authStore.setBalance(updatedBalance);
      }
      const tradeData = {
        additionalAmount,
        askPrice,
        payoutValue,
        previousSpot,
        currentSpot,
        tickDuration,
        strategy,
        status,
        basis,
        marketType,
        timestamp,
      };
      const totalProfit = authStore.totalAmountWon;
      const totalLoss = authStore.totalAmountLost;
      const netWorth = totalProfit - totalLoss;
      const tradeSummary = {
        totalProfit,
        totalLoss,
        netWorth,
        timestamp,
      };
      console.log("dd", tradeData);

      await addDoc(
        collection(db, "users", auth.currentUser!.uid, "tradeHistory"),
        tradeData
      );
      await updateDoc(
        doc(db, "users", auth.currentUser!.uid, "tradeHistory", "tradeSummary"),
        tradeSummary
      );
      setIsProcessing(false);
    } catch (error) {
      console.error("Error:", error);
      authStore.setAlert({
        open: true,
        message: `Error. Try again later`,
        type: "error",
      });
      const updatedBalance = currentBalance + payoutValue;
      authStore.setBalance(updatedBalance);
      setIsProcessing(false);
    }
  };

  const decrementPayout = () => {
    if (proposalStore.payout > 1) {
      proposalStore.setPayout(proposalStore.payout - 1);
    }
  };

  const incrementPayout = () => {
    if (proposalStore.payout < 500) {
      proposalStore.setPayout(proposalStore.payout + 1);
    }
  };

  useEffect(() => {
    if (id) {
      proposalStore.getProposal(id);
    }
  }, [
    id,
    proposalStore.basis,
    proposalStore.payout,
    proposalStore.duration,
    proposalStore.contractType,
  ]);

  // console.log(proposalStore.payout)

  var payout = 0;
  var ask_price = 0;
  var longcode = "";
  if (apiStore.ticks.length > 0 && proposalStore.proposalData.length > 0) {
    payout = Number(
      proposalStore.proposalData[proposalStore.proposalData.length - 1].payout
    );
    ask_price = Number(
      proposalStore.proposalData[proposalStore.proposalData.length - 1]
        .ask_price
    );
    longcode =
      proposalStore.proposalData[proposalStore.proposalData.length - 1]
        .longcode;
  }

  console.log(authStore.totalAmountWon);

  return (
    <Box>
      {AuthStore.user ? (
        <Box style={{margin: '10px'}}>
            <Fab
            aria-label="drawer"
            onClick={handleFabClick}
            style={{
              position: "fixed",
              top: "140px",
              right: "20px",
              display: window.innerWidth < 518 ? "block" : "none",
              backgroundColor:"#0033ff",
              color: "white",
            }}
          >
            {isDrawerOpen ? "X" : "Buy"}
          </Fab>
          {isDrawerOpen && window.innerWidth < 518 ? (
            <Box style={{ position: "fixed", bottom: "0", left: "0", width: "100%", height: "50%", backgroundColor: theme.palette.background.paper, zIndex: 999 }}>
              <Box className="proposal-ticks">
            <Typography sx={{ marginRight: "1vw", fontFamily: "Roboto" }}>
              Ticks:{" "}
            </Typography>
            <Box className="duration-change-slider">
    <Slider
      name="duration-change"
      value={proposalStore.duration}
      onChange={handleDurationChange}
      defaultValue={5}
      marks
      min={1}
      max={10}
      step={1}
      sx={{
        "& .MuiSlider-thumb": {
          width: 26,
          height: 26,
          backgroundColor: "white",
          border: theme.palette.mode === "dark" ? "3px solid white" : "3px solid blue",
          marginTop: -6,
          marginLeft: -8,
          transform: 'translate(210%,140%)',
          "&:hover, &:active, &.Mui-focusVisible": {
            boxShadow: "none",
          },
        },
        "& .MuiSlider-mark": {
          width: 8,
          height: 8,
          borderRadius: "50%",
          marginTop: -3,
          transform: 'translateY(260%)',
          border: theme.palette.mode === "dark" ? "none" : "1px solid blue",
          backgroundColor: theme.palette.mode === "dark" ? 'white' : 'white',
        },
      }}
    />
  </Box>
          </Box>
          <Box className="proposal-btn-group">
            <Button
              style={{
                backgroundColor:
                  proposalStore.basis === "payout" ? "blue" : theme.palette.background.default,
                color: proposalStore.basis === "payout" ? "white" : "blue",
              }}
              className="proposal-options"
              onClick={() => proposalStore.setBasis("payout")}
            >
              Payout
            </Button>
            <Button
              style={{
                backgroundColor:
                  proposalStore.basis === "stake" ? "blue" : theme.palette.background.default,
                color: proposalStore.basis === "stake" ? "white" : "blue",
              }}
              className="proposal-options"
              onClick={() => proposalStore.setBasis("stake")}
            >
              Stake
            </Button>
          </Box>
          <Box className="proposal-input-container">
    <Button
      variant="outlined"
      className="proposal-input-btn left"
      onClick={decrementPayout}
      disabled={proposalStore.payout <= 0.99}
    >
      -
    </Button>
    <TextField
      type="number"
      value={proposalStore.payout}
      onChange={handlePayoutChange}
      inputProps={{
        min: "1.00",
        max: "500.00",
        step: "0.01",
      }}
      disabled={apiStore.ticks.length < 0}
      className="proposal-input-field"
    />
    <Button
      variant="outlined"
      // style={{fontSize: '50px'}}
      className="proposal-input-btn right"
      onClick={incrementPayout}
      disabled={proposalStore.payout >= 500.01}
    >
      +
    </Button>
  </Box>
          <Typography
            sx={{
              // marginRight: "1vw",
              fontSize: "14px",
              fontFamily: "Roboto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Number.isNaN(proposalStore.payout)
              ? "Please input a valid number"
              : "Input value between 1 to 500 USD"}
          </Typography>

          <Box ref={proposalContainerRef} id="proposalContainer"></Box>
          <Box className="proposal-btn-choices-fab" >
            <span className="proposal-btn-span">
              <button
                className={`proposal-btn-buy ${
                  isProcessing ||
                  proposalStore.payout >= 500.01 ||
                  proposalStore.payout <= 0.99 ||
                  Number.isNaN(proposalStore.payout)
                    ? "processing"
                    : ""
                } higher `}
                onClick={() => handleBuy(true)}
                disabled={
                  isProcessing ||
                  proposalStore.payout >= 500.01 ||
                  proposalStore.payout <= 0.99 ||
                  Number.isNaN(proposalStore.payout)
                }
              >
                <NorthEast style={{marginRight: '10px'}}/>
                Higher
              </button>
              <Box style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} onClick={openQuoteModal}>
              <MoneySend color="green" size={40}/>
              <Typography style={{fontSize:'10px', color:"green"}}>Quote Price</Typography>
              </Box>
            </span>
            {isQuoteModalOpen && (
              <Modal open={isQuoteModalOpen} onClose={closeQuoteModal}>
                <Box sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "500px",
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.secondary,
              boxShadow: 24,
              p: '20px', display: 'flex', alignItems: 'center'
            }}>
              <img style={{height: '80px', margin: '16px'}}
          src={MarketSymbols[id!]}
          alt={id!}
        /><Box>
              <Typography>Contract Type: CALL</Typography>
              <Typography>{`Payout ${payout} USD for asking price of ${ask_price} USD`}</Typography>
              <Typography>{longcode}</Typography></Box></Box>
            </Modal>
            )}
            <span className="proposal-btn-span">
              <button
                className={`proposal-btn-buy ${
                  isProcessing ||
                  proposalStore.payout >= 500.01 ||
                  proposalStore.payout <= 0.99 ||
                  Number.isNaN(proposalStore.payout)
                    ? "processing"
                    : ""
                } lower`}
                onClick={() => handleBuy(false)}
                disabled={
                  isProcessing ||
                  proposalStore.payout >= 500.01 ||
                  proposalStore.payout <= 0.99 ||
                  Number.isNaN(proposalStore.payout)
                }
              >
                <SouthEast style={{marginRight: '10px'}}/>
                Lower
              </button>
              <Box  style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                onClick={openSecondQuoteModal}
              >
                <MoneySend color="red" size={40}/>
              <Typography style={{fontSize:'10px', color:"red"}}>Quote Price</Typography>
              </Box>
            </span>
            {isSecondQuoteModalOpen && (
              <Modal open={isSecondQuoteModalOpen} onClose={closeSecondQuoteModal}>
              <Box sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "500px",
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.secondary,
              boxShadow: 24,
              p: '20px', display: 'flex', alignItems: 'center'
            }}>
              <img style={{height: '80px', margin: '16px'}}
          src={MarketSymbols[id!]}
          alt={id!}
        /><Box>
              <Typography>Contract Type: PUT</Typography>
              <Typography>{`Payout ${payout} USD for asking price of ${ask_price} USD`}</Typography>
              <Typography>{longcode}</Typography></Box></Box>
            </Modal>
            )}
          </Box>
          <Box style={{display: 'flex', justifyContent: 'flex-end', color: '#0033ff', margin: '10px'}}>
          <Typography onClick={() => navigate('/trade-history')} style={{fontSize: '14px', cursor: 'pointer'}}>See full trade history {">"}</Typography>
          </Box>
        </Box>):
              <Box style={{display: window.innerWidth < 518 ? "none" : "block"}}>
              <Box className="proposal-ticks">
              <Typography sx={{ marginRight: "1vw", fontFamily: "Roboto" }}>
                Ticks:{" "}
              </Typography>
              <Box className="duration-change-slider">
      <Slider
        name="duration-change"
        value={proposalStore.duration}
        onChange={handleDurationChange}
        defaultValue={5}
        marks
        min={1}
        max={10}
        step={1}
        sx={{
          "& .MuiSlider-thumb": {
            width: 26,
            height: 26,
            backgroundColor: "white",
            border: theme.palette.mode === "dark" ? "3px solid white" : "3px solid blue",
            marginTop: -6,
            marginLeft: -8,
            transform: 'translate(210%,140%)',
            "&:hover, &:active, &.Mui-focusVisible": {
              boxShadow: "none",
            },
          },
          "& .MuiSlider-mark": {
            width: 8,
            height: 8,
            borderRadius: "50%",
            marginTop: -3,
            transform: 'translateY(260%)',
            border: theme.palette.mode === "dark" ? "none" : "1px solid blue",
            backgroundColor: theme.palette.mode === "dark" ? 'white' : 'white',
          },
        }}
      />
    </Box>
            </Box>
            <Box className="proposal-btn-group">
              <Button
                style={{
                  backgroundColor:
                    proposalStore.basis === "payout" ? "blue" : theme.palette.background.default,
                  color: proposalStore.basis === "payout" ? "white" : "blue",
                }}
                className="proposal-options"
                onClick={() => proposalStore.setBasis("payout")}
              >
                Payout
              </Button>
              <Button
                style={{
                  backgroundColor:
                    proposalStore.basis === "stake" ? "blue" : theme.palette.background.default,
                  color: proposalStore.basis === "stake" ? "white" : "blue",
                }}
                className="proposal-options"
                onClick={() => proposalStore.setBasis("stake")}
              >
                Stake
              </Button>
            </Box>
            <Box className="proposal-input-container">
      <Button
        variant="outlined"
        className="proposal-input-btn left"
        onClick={decrementPayout}
        disabled={proposalStore.payout <= 0.99}
      >
        -
      </Button>
      <TextField
        type="number"
        value={proposalStore.payout}
        onChange={handlePayoutChange}
        inputProps={{
          min: "1.00",
          max: "500.00",
          step: "0.01",
        }}
        disabled={apiStore.ticks.length < 0}
        className="proposal-input-field"
      />
      <Button
        variant="outlined"
        // style={{fontSize: '50px'}}
        className="proposal-input-btn right"
        onClick={incrementPayout}
        disabled={proposalStore.payout >= 500.01}
      >
        +
      </Button>
    </Box>
            <Typography
              sx={{
                // marginRight: "1vw",
                fontSize: "14px",
                fontFamily: "Roboto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {Number.isNaN(proposalStore.payout)
                ? "Please input a valid number"
                : "Input value between 1 to 500 USD"}
            </Typography>
  
            <Box ref={proposalContainerRef} id="proposalContainer"></Box>
            <Box className="proposal-btn-choices" style={{ display: "grid", gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',gridGap: '10px', justifyItems: 'center'}}>
              <span className="proposal-btn-span">
                <button
                  className={`proposal-btn-buy ${
                    isProcessing ||
                    proposalStore.payout >= 500.01 ||
                    proposalStore.payout <= 0.99 ||
                    Number.isNaN(proposalStore.payout)
                      ? "processing"
                      : ""
                  } higher `}
                  onClick={() => handleBuy(true)}
                  disabled={
                    isProcessing ||
                    proposalStore.payout >= 500.01 ||
                    proposalStore.payout <= 0.99 ||
                    Number.isNaN(proposalStore.payout)
                  }
                >
                  <NorthEast style={{marginRight: '10px'}}/>
                  Higher
                </button>
                <Box style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} onClick={openQuoteModal}>
                <MoneySend color="green" size={40}/>
                <Typography style={{fontSize:'10px', color:"green"}}>Quote Price</Typography>
                </Box>
              </span>
              {isQuoteModalOpen && (
                <Modal open={isQuoteModalOpen} onClose={closeQuoteModal}>
                  <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "500px",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                boxShadow: 24,
                p: '20px', display: 'flex', alignItems: 'center'
              }}>
                <img style={{height: '80px', margin: '16px'}}
            src={MarketSymbols[id!]}
            alt={id!}
          /><Box>
                <Typography>Contract Type: CALL</Typography>
                <Typography>{`Payout ${payout} USD for asking price of ${ask_price} USD`}</Typography>
                <Typography>{longcode}</Typography></Box></Box>
              </Modal>
              )}
              <span className="proposal-btn-span">
                <button
                  className={`proposal-btn-buy ${
                    isProcessing ||
                    proposalStore.payout >= 500.01 ||
                    proposalStore.payout <= 0.99 ||
                    Number.isNaN(proposalStore.payout)
                      ? "processing"
                      : ""
                  } lower`}
                  onClick={() => handleBuy(false)}
                  disabled={
                    isProcessing ||
                    proposalStore.payout >= 500.01 ||
                    proposalStore.payout <= 0.99 ||
                    Number.isNaN(proposalStore.payout)
                  }
                >
                  <SouthEast style={{marginRight: '10px'}}/>
                  Lower
                </button>
                <Box  style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                  onClick={openSecondQuoteModal}
                >
                  <MoneySend color="red" size={40}/>
                <Typography style={{fontSize:'10px', color:"red"}}>Quote Price</Typography>
                </Box>
              </span>
              {isSecondQuoteModalOpen && (
                <Modal open={isSecondQuoteModalOpen} onClose={closeSecondQuoteModal}>
                <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "500px",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.secondary,
                boxShadow: 24,
                p: '20px', display: 'flex', alignItems: 'center'
              }}>
                <img style={{height: '80px', margin: '16px'}}
            src={MarketSymbols[id!]}
            alt={id!}
          /><Box>
                <Typography>Contract Type: PUT</Typography>
                <Typography>{`Payout ${payout} USD for asking price of ${ask_price} USD`}</Typography>
                <Typography>{longcode}</Typography></Box></Box>
              </Modal>
              )}
            </Box>
            {authStore.totalAmountWon !== 0 && (
            <Card style={{margin: '10px', padding: '10px'}}>
                <Box>
                  {apiStore.additionalAmount !== 0 && apiStore.deductedAmount === 0 && (
                    <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                      
                  <Typography style={{color: 'green'}}>You Won!<NorthEast/></Typography>
                      <Typography>Profit: +{apiStore.additionalAmount.toFixed(2)} USD</Typography>
                      </Box>
                  )}
                  <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'}}>Total Won: {Number(authStore.totalAmountWon).toFixed(2)} USD</Box>
                </Box>
            </Card>)}
              {authStore.totalAmountLost !== 0 && (
            <Card style={{margin: '10px', padding: '10px'}}>
                <div>
                  {apiStore.deductedAmount !== 0 && apiStore.additionalAmount === 0 && (
                    <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                      
                    <Typography style={{color: 'red'}}><SouthEast/>You Lost :(</Typography>
                        <Typography>Loss: -{apiStore.deductedAmount.toFixed(2)} USD</Typography>
                        </Box>
                  )}
                  <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'}}>Total Lost: {Number(authStore.totalAmountLost).toFixed(2)} USD</Box>
                </div>
            </Card>
              )}
            <Box style={{display: 'flex', justifyContent: 'flex-end', color: '#0033ff', margin: '10px'}}>
            <Typography onClick={() => navigate('/trade-history')} style={{fontSize: '14px', cursor: 'pointer'}}>See full trade history {">"}</Typography>
            </Box>
          </Box>
              }
          </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: 'column',
            height: '500px'
          }}
        >
          <Typography variant="body1">Login to start trading</Typography>
        </Box>
      )}
    </Box>
  );
});

export default Proposal;
