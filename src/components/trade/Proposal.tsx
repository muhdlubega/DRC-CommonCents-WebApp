import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/main.scss";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Box, Button, Card, Slider, TextField, Typography, useTheme } from "@mui/material";
import apiStore from "../../store/ApiStore";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import { auth, db } from "../../firebase";
import proposalStore from "../../store/ProposalStore";
import AuthStore from "../../store/AuthStore";
import { InfoCircle } from "iconsax-react";

const Proposal = observer(() => {
  const { id } = useParams<{ id: string }>();
  const proposalContainerRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSecondDropdownOpen, setIsSecondDropdownOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isSecondQuoteOpen, setIsSecondQuoteOpen] = useState(false);
  const theme = useTheme();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const toggleSecondDropdown = () => {
    setIsSecondDropdownOpen((prevState) => !prevState);
  };

  const toggleQuote = () => {
    proposalStore.setContractType("CALL");
    setIsQuoteOpen((prevState) => !prevState);
  };

  const toggleSecondQuote = () => {
    proposalStore.setContractType("PUT");
    setIsSecondQuoteOpen((prevState) => !prevState);
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
          backgroundColor: "blue",
          border: theme.palette.mode === "dark" ? "5px solid white" : "5px solid #C5C5C5",
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
          backgroundColor: theme.palette.mode === "dark" ? 'white' : '#C5C5C5',
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
      className="proposal-input-btn right"
      onClick={incrementPayout}
      disabled={proposalStore.payout >= 500.01}
    >
      +
    </Button>
  </Box>
          <Typography
            sx={{
              marginRight: "1vw",
              fontSize: "1vw",
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
          <Box className="proposal-btn-choices">
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
                {/* <ArrowUp2 />  */}
                Higher{" "}
                <InfoCircle
                  color="#ffffff"
                  size={24}
                  onMouseLeave={toggleDropdown}
                  onMouseEnter={toggleDropdown}
                  style={{ marginRight: "0.5vw", cursor: "pointer" }}
                />
              </button>
              <Typography onMouseEnter={toggleQuote} onMouseLeave={toggleQuote}>
                Quote Price
              </Typography>
            </span>
            {isQuoteOpen && (
              <Typography
                sx={{
                  marginLeft: "12vw",
                  fontSize: "1vw",
                  fontFamily: "Roboto",
                }}
              >
                {proposalStore.basis === "stake"
                  ? `Payout: ${payout}`
                  : `Ask Price: ${ask_price}`}
              </Typography>
            )}
            {isDropdownOpen && <Box>{longcode}</Box>}
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
                {/* <ArrowDown2 />  */}
                Lower{" "}
                <InfoCircle
                  color="#ffffff"
                  size={24}
                  onMouseLeave={toggleSecondDropdown}
                  onMouseEnter={toggleSecondDropdown}
                  style={{ marginRight: "0.5vw", cursor: "pointer" }}
                />
              </button>
              <Typography
                onMouseEnter={toggleSecondQuote}
                onMouseLeave={toggleSecondQuote}
              >
                Quote Price
              </Typography>
            </span>
            {isSecondQuoteOpen && (
              <Typography
                sx={{
                  marginLeft: "12vw",
                  fontSize: "1vw",
                  fontFamily: "Roboto",
                }}
              >
                {proposalStore.basis === "stake"
                  ? `Payout: ${payout}`
                  : `Ask Price: ${ask_price}`}
              </Typography>
            )}
            {isSecondDropdownOpen && (
              <Box>{longcode.replace("higher", "lower")}</Box>
            )}
          </Box>
          <Card style={{margin: '10px', padding: '10px'}}>
            {authStore.totalAmountWon !== 0 && (
              <div>
                {apiStore.additionalAmount !== 0 && (
                  <div>Won {apiStore.additionalAmount.toFixed(2)} USD</div>
                )}
                <div>Total Won: {Number(authStore.totalAmountWon).toFixed(2)} USD</div>
              </div>
            )}
          </Card>
          <Card style={{margin: '10px', padding: '10px'}}>
            {authStore.totalAmountLost !== 0 && (
              <div>
                {apiStore.deductedAmount !== 0 && (
                  <div>Lost {apiStore.deductedAmount.toFixed(2)} USD</div>
                )}
                <div>
                  Total Lost: {Number(authStore.totalAmountLost).toFixed(2)} USD
                </div>
              </div>
            )}
          </Card>
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
