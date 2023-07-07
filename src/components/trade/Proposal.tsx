import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/main.scss";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Box, Typography } from "@mui/material";
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

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(event.target.id, 10);
    proposalStore.setDuration(newDuration);
  };

  const handlePayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPayout = parseFloat(event.target.value);
    proposalStore.setPayout(newPayout);
  };

  const tickDuration = proposalStore.duration;
  const basis = proposalStore.basis;
  const marketType = apiStore.selectedSymbol;

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

      proposalStore.contractType = isHigher ? "CALL" : "PUT";

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

    const previousSpot = apiStore.isTicks
      ? apiStore.ticks[apiStore.ticks.length - tickDuration - 1].quote
      : apiStore.ticks[apiStore.ticks.length - tickDuration - 1]
          .close;
    const currentSpot = apiStore.isTicks
      ? apiStore.ticks[apiStore.ticks.length - 1].quote
      : apiStore.ticks[apiStore.ticks.length - 1].close;

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
            status = 'Win';
            apiStore.setSellSuccessful(true);
            apiStore.setAdditionalAmount(additionalAmount);
            apiStore.setTotalAmountWon(
              apiStore.totalAmountWon + additionalAmount
            );
          } else {
            console.log("Spot is not higher", additionalAmount);
            authStore.setAlert({
              open: true,
              message: `Spot is not higher. You lost USD ${askPrice} :(`,
              type: "error",
            });
            status = 'Lose';
            apiStore.setSellFailed(true);
            apiStore.setDeductedAmount(askPrice);
            apiStore.setTotalAmountLost(apiStore.totalAmountLost + askPrice);
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
            status = 'Win';
            apiStore.setSellSuccessful(true);
            apiStore.setAdditionalAmount(additionalAmount);
            apiStore.setTotalAmountWon(
              apiStore.totalAmountWon + additionalAmount
            );
          } else {
            console.log("Spot is not lower", additionalAmount);
            authStore.setAlert({
              open: true,
              message: `Spot is not lower. You lost USD ${askPrice} :(`,
              type: "error",
            });
            status = 'Lose';
            apiStore.setSellFailed(true);
            apiStore.setDeductedAmount(askPrice);
            apiStore.setTotalAmountLost(apiStore.totalAmountLost + askPrice);
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
        marketType
      };
      console.log("dd", tradeData);

      await addDoc(
        collection(db, "users", auth.currentUser!.uid, "tradeHistory"),
        tradeData
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

  return (
    <Box>
      {AuthStore.user ? (
        <Box>
          <Box className="proposal-ticks">
            <Typography sx={{ marginRight: "1vw", fontFamily: "Montserrat" }}>
              Ticks:{" "}
            </Typography>
            <Box className="duration-change-slider">
              <input
                required
                type="radio"
                name="duration-change"
                className="duration-change-btn"
                id="1"
                value={proposalStore.duration}
                onChange={handleDurationChange}
              />
              <label className="duration-change-label" htmlFor="1">
                1
              </label>
              <input
                required
                type="radio"
                name="duration-change"
                className="duration-change-btn"
                id="2"
                value={proposalStore.duration}
                onChange={handleDurationChange}
              />
              <label className="duration-change-label" htmlFor="2">
                2
              </label>
              <input
                required
                type="radio"
                name="duration-change"
                className="duration-change-btn"
                id="3"
                value={proposalStore.duration}
                onChange={handleDurationChange}
              />
              <label className="duration-change-label" htmlFor="3">
                3
              </label>
              <input
                required
                type="radio"
                name="duration-change"
                className="duration-change-btn"
                id="4"
                value={proposalStore.duration}
                onChange={handleDurationChange}
              />
              <label className="duration-change-label" htmlFor="4">
                4
              </label>
              <input
                required
                type="radio"
                name="duration-change"
                className="duration-change-btn"
                id="5"
                value={proposalStore.duration}
                onChange={handleDurationChange}
                defaultChecked
              />
              <label className="duration-change-label" htmlFor="5">
                5
              </label>
              <input
                required
                type="radio"
                name="duration-change"
                className="duration-change-btn"
                id="6"
                value={proposalStore.duration}
                onChange={handleDurationChange}
              />
              <label className="duration-change-label" htmlFor="6">
                6
              </label>
              <input
                required
                type="radio"
                name="duration-change"
                className="duration-change-btn"
                id="7"
                value={proposalStore.duration}
                onChange={handleDurationChange}
              />
              <label className="duration-change-label" htmlFor="7">
                7
              </label>
              <input
                required
                type="radio"
                name="duration-change"
                className="duration-change-btn"
                id="8"
                value={proposalStore.duration}
                onChange={handleDurationChange}
              />
              <label className="duration-change-label" htmlFor="8">
                8
              </label>
              <input
                required
                type="radio"
                name="duration-change"
                className="duration-change-btn"
                id="9"
                value={proposalStore.duration}
                onChange={handleDurationChange}
              />
              <label className="duration-change-label" htmlFor="9">
                9
              </label>
              <input
                required
                type="radio"
                name="duration-change"
                className="duration-change-btn"
                id="10"
                value={proposalStore.duration}
                onChange={handleDurationChange}
              />
              <label className="duration-change-label" htmlFor="10">
                10
              </label>
            </Box>
          </Box>
          <Box className="proposal-btn-group">
            <button
              style={{
                backgroundColor:
                  proposalStore.basis === "payout" ? "blue" : "white",
                color: proposalStore.basis === "payout" ? "white" : "blue",
              }}
              className="proposal-options"
              onClick={() => proposalStore.setBasis("payout")}
            >
              Payout
            </button>
            <button
              style={{
                backgroundColor:
                  proposalStore.basis === "stake" ? "blue" : "white",
                color: proposalStore.basis === "stake" ? "white" : "blue",
              }}
              className="proposal-options"
              onClick={() => proposalStore.setBasis("stake")}
            >
              Stake
            </button>
          </Box>
          <Box className="proposal-input-container">
            <button
              className="proposal-input-btn left"
              onClick={decrementPayout}
              disabled={proposalStore.payout <= 0.99}
            >
              -
            </button>
            <input
              type="number"
              value={proposalStore.payout}
              onChange={handlePayoutChange}
              min="1.00"
              max="500.00"
              step="0.01"
              disabled={apiStore.ticks.length < 0}
              className="proposal-input-field"
            />
            <button
              className="proposal-input-btn right"
              onClick={incrementPayout}
              disabled={proposalStore.payout >= 500.01}
            >
              +
            </button>
          </Box>
          <Typography
            sx={{
              marginRight: "1vw",
              fontSize: "1vw",
              fontFamily: "Montserrat",
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
                  fontFamily: "Montserrat",
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
                  fontFamily: "Montserrat",
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
          <Box>
            {apiStore.sellSuccessful && (
              <div>
                <div>Won {apiStore.additionalAmount.toFixed(2)} USD</div>
                <div>
                  Total Won For This Session:{" "}
                  {apiStore.totalAmountWon.toFixed(2)} USD
                </div>
              </div>
            )}
          </Box>
          <Box>
            {apiStore.sellFailed && (
              <div>
                <div>Lost {apiStore.deductedAmount.toFixed(2)} USD</div>
                <div>
                  Total Lost For This Session:{" "}
                  {apiStore.totalAmountLost.toFixed(2)} USD
                </div>
              </div>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Login to start trading
        </Box>
      )}
    </Box>
  );
});

export default Proposal;
