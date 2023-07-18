import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Fab,
  Modal,
  Slider,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import apiStore from "../../store/ApiStore";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import proposalStore from "../../store/ProposalStore";
import AuthStore from "../../store/AuthStore";
import { MoneyRecive, MoneySend } from "iconsax-react";
import { NorthEast, SouthEast, SouthWest } from "@mui/icons-material";
import { MarketSymbols } from "../../arrays/MarketArray";
import contractStore from "../../store/ContractStore";

const Proposal = observer(() => {
  const { id } = useParams<{ id: string }>();
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

  authStore.getUserNetWorth();

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
        <Box style={{ margin: "10px" }}>
          <Fab
            aria-label="drawer"
            onClick={handleFabClick}
            className="proposal-fab"
            style={{
              backgroundColor: "#0033ff",
              color: "white",
              display: window.innerWidth < 518 ? "block" : "none",
            }}
          >
            {isDrawerOpen ? "X" : "Buy"}
          </Fab>
          {isDrawerOpen && window.innerWidth < 518 ? (
            <Box
              className="proposal-bottom-drawer"
              style={{ backgroundColor: theme.palette.background.paper }}
            >
              <Box className="proposal-ticks">
                <Typography className="proposal-ticks-txt">Ticks:</Typography>
                <Box className="duration-change-slider">
                  <Slider
                    name="duration-change"
                    value={proposalStore.duration}
                    disabled={
                      contractStore.isProcessing || apiStore.ticks.length === 0
                    }
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
                        border:
                          theme.palette.mode === "dark"
                            ? "3px solid white"
                            : apiStore.ticks.length === 0 ||
                              contractStore.isProcessing
                            ? "gray"
                            : "3px solid blue",
                        marginTop: -6,
                        marginLeft: -8,
                        transform: "translate(210%,140%)",
                        "&:hover, &:active, &.Mui-focusVisible": {
                          boxShadow: "none",
                        },
                      },
                      "& .MuiSlider-mark": {
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        marginTop: -3,
                        transform: "translateY(260%)",
                        border:
                          theme.palette.mode === "dark"
                            ? "none"
                            : apiStore.ticks.length === 0 ||
                              contractStore.isProcessing
                            ? "gray"
                            : "1px solid blue",
                        backgroundColor:
                          theme.palette.mode === "dark" ? "white" : "white",
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box className="proposal-btn-group">
                <Button
                  style={{
                    backgroundColor:
                      proposalStore.basis === "payout"
                        ? apiStore.ticks.length === 0 ||
                          contractStore.isProcessing
                          ? "gray"
                          : "blue"
                        : theme.palette.background.default,
                    color:
                      proposalStore.basis === "payout"
                        ? "white"
                        : apiStore.ticks.length === 0 ||
                          contractStore.isProcessing
                        ? "gray"
                        : "blue",
                  }}
                  className="proposal-options"
                  onClick={() => proposalStore.setBasis("payout")}
                  disabled={
                    contractStore.isProcessing || apiStore.ticks.length === 0
                  }
                >
                  Payout
                </Button>
                <Button
                  style={{
                    backgroundColor:
                      proposalStore.basis === "stake"
                        ? apiStore.ticks.length === 0 ||
                          contractStore.isProcessing
                          ? "gray"
                          : "blue"
                        : theme.palette.background.default,
                    color:
                      proposalStore.basis === "stake"
                        ? "white"
                        : apiStore.ticks.length === 0 ||
                          contractStore.isProcessing
                        ? "gray"
                        : "blue",
                  }}
                  className="proposal-options"
                  onClick={() => proposalStore.setBasis("stake")}
                  disabled={
                    contractStore.isProcessing || apiStore.ticks.length === 0
                  }
                >
                  Stake
                </Button>
              </Box>
              <Box className="proposal-input-container">
                <Button
                  variant="outlined"
                  className="proposal-input-btn left"
                  onClick={decrementPayout}
                  disabled={
                    contractStore.isProcessing ||
                    apiStore.ticks.length === 0 ||
                    proposalStore.payout <= 0.99
                  }
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
                  disabled={
                    contractStore.isProcessing ||
                    apiStore.ticks.length === 0 ||
                    apiStore.ticks.length < 0
                  }
                  className="proposal-input-field"
                />
                <Button
                  variant="outlined"
                  className="proposal-input-btn right"
                  onClick={incrementPayout}
                  disabled={
                    contractStore.isProcessing ||
                    apiStore.ticks.length === 0 ||
                    proposalStore.payout >= 500.01
                  }
                >
                  +
                </Button>
              </Box>
              <Typography className="proposal-input-txt">
                {Number.isNaN(proposalStore.payout)
                  ? "Please input a valid number"
                  : "Input value between 1 to 500 USD"}
              </Typography>
              <Box className="proposal-btn-choices-fab">
                <span className="proposal-btn-span">
                  <button
                    className={`proposal-btn-fab ${
                      contractStore.isProcessing ||
                      apiStore.ticks.length === 0 ||
                      proposalStore.payout >= 500.01 ||
                      proposalStore.payout <= 0.99 ||
                      Number.isNaN(proposalStore.payout)
                        ? "processing"
                        : ""
                    } higher `}
                    onClick={() => contractStore.handleBuy(true)}
                    disabled={
                      contractStore.isProcessing ||
                      apiStore.ticks.length === 0 ||
                      proposalStore.payout >= 500.01 ||
                      proposalStore.payout <= 0.99 ||
                      Number.isNaN(proposalStore.payout)
                    }
                  >
                    <NorthEast className="proposal-btn-icon" />
                    Higher
                  </button>
                  <Box className="quote-price-box" onClick={openQuoteModal}>
                    <MoneySend
                      color={
                        apiStore.ticks.length === 0 ||
                        contractStore.isProcessing
                          ? "gray"
                          : "green"
                      }
                      size={32}
                    />
                  </Box>
                </span>
                {isQuoteModalOpen && (
                  <Modal open={isQuoteModalOpen} onClose={closeQuoteModal}>
                    <Box
                      sx={{
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.secondary,
                      }}
                      className="quote-price-modal"
                    >
                      <img
                        className="quote-price-img"
                        src={MarketSymbols[id!]}
                        alt={id!}
                      />
                      <Box>
                        <Typography>Contract Type: CALL</Typography>
                        <Typography>{`Payout ${payout} USD for asking price of ${ask_price} USD`}</Typography>
                        <Typography>{longcode}</Typography>
                      </Box>
                    </Box>
                  </Modal>
                )}
                <span className="proposal-btn-span">
                  <button
                    className={`proposal-btn-fab ${
                      contractStore.isProcessing ||
                      apiStore.ticks.length === 0 ||
                      proposalStore.payout >= 500.01 ||
                      proposalStore.payout <= 0.99 ||
                      Number.isNaN(proposalStore.payout)
                        ? "processing"
                        : ""
                    } lower`}
                    onClick={() => contractStore.handleBuy(false)}
                    disabled={
                      contractStore.isProcessing ||
                      apiStore.ticks.length === 0 ||
                      proposalStore.payout >= 500.01 ||
                      proposalStore.payout <= 0.99 ||
                      Number.isNaN(proposalStore.payout)
                    }
                  >
                    <SouthEast className="proposal-btn-icon" />
                    Lower
                  </button>
                  <Box
                    className="quote-price-box"
                    onClick={openSecondQuoteModal}
                  >
                    <MoneyRecive
                      color={
                        apiStore.ticks.length === 0 ||
                        contractStore.isProcessing
                          ? "gray"
                          : "red"
                      }
                      size={32}
                    />
                  </Box>
                </span>
                {isSecondQuoteModalOpen && (
                  <Modal
                    open={isSecondQuoteModalOpen}
                    onClose={closeSecondQuoteModal}
                  >
                    <Box
                      sx={{
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.secondary,
                      }}
                      className="quote-price-modal"
                    >
                      <img
                        className="quote-price-img"
                        src={MarketSymbols[id!]}
                        alt={id!}
                      />
                      <Box>
                        <Typography>Contract Type: PUT</Typography>
                        <Typography>{`Payout ${payout} USD for asking price of ${ask_price} USD`}</Typography>
                        <Typography>{longcode}</Typography>
                      </Box>
                    </Box>
                  </Modal>
                )}
              </Box>
              <Box className="trade-history-navbox">
                <Typography
                  className="trade-history-nav"
                  onClick={() => navigate("/trade-history")}
                >
                  See full trade history {">"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box className="proposal-area">
              <Box className="proposal-ticks">
                <Typography className="proposal-ticks-txt">Ticks:</Typography>
                <Box className="duration-change-slider">
                  <Slider
                    name="duration-change"
                    value={proposalStore.duration}
                    onChange={handleDurationChange}
                    disabled={
                      contractStore.isProcessing || apiStore.ticks.length === 0
                    }
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
                        border:
                          theme.palette.mode === "dark"
                            ? "3px solid white"
                            : apiStore.ticks.length === 0 ||
                              contractStore.isProcessing
                            ? "gray"
                            : "3px solid blue",
                        marginTop: -6,
                        marginLeft: -8,
                        transform: "translate(210%,140%)",
                        "&:hover, &:active, &.Mui-focusVisible": {
                          boxShadow: "none",
                        },
                      },
                      "& .MuiSlider-mark": {
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        marginTop: -3,
                        transform: "translateY(260%)",
                        border:
                          theme.palette.mode === "dark"
                            ? "none"
                            : apiStore.ticks.length === 0 ||
                              contractStore.isProcessing
                            ? "gray"
                            : "1px solid blue",
                        backgroundColor:
                          theme.palette.mode === "dark" ? "white" : "white",
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box className="proposal-btn-group">
                <Button
                  style={{
                    backgroundColor:
                      proposalStore.basis === "payout"
                        ? apiStore.ticks.length === 0 ||
                          contractStore.isProcessing
                          ? "gray"
                          : "blue"
                        : theme.palette.background.default,
                    color:
                      proposalStore.basis === "payout"
                        ? "white"
                        : apiStore.ticks.length === 0 ||
                          contractStore.isProcessing
                        ? "gray"
                        : "blue",
                  }}
                  className="proposal-options"
                  onClick={() => proposalStore.setBasis("payout")}
                  disabled={
                    contractStore.isProcessing || apiStore.ticks.length === 0
                  }
                >
                  Payout
                </Button>
                <Button
                  style={{
                    backgroundColor:
                      proposalStore.basis === "stake"
                        ? apiStore.ticks.length === 0 ||
                          contractStore.isProcessing
                          ? "gray"
                          : "blue"
                        : theme.palette.background.default,
                    color:
                      proposalStore.basis === "stake"
                        ? "white"
                        : apiStore.ticks.length === 0 ||
                          contractStore.isProcessing
                        ? "gray"
                        : "blue",
                  }}
                  className="proposal-options"
                  onClick={() => proposalStore.setBasis("stake")}
                  disabled={
                    contractStore.isProcessing || apiStore.ticks.length === 0
                  }
                >
                  Stake
                </Button>
              </Box>
              <Box className="proposal-input-container">
                <Button
                  variant="outlined"
                  className="proposal-input-btn left"
                  onClick={decrementPayout}
                  disabled={
                    contractStore.isProcessing ||
                    apiStore.ticks.length === 0 ||
                    proposalStore.payout <= 0.99
                  }
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
                  disabled={
                    contractStore.isProcessing ||
                    apiStore.ticks.length === 0 ||
                    apiStore.ticks.length < 0
                  }
                  className="proposal-input-field"
                />
                <Button
                  variant="outlined"
                  className="proposal-input-btn right"
                  onClick={incrementPayout}
                  disabled={
                    contractStore.isProcessing ||
                    apiStore.ticks.length === 0 ||
                    proposalStore.payout >= 500.01
                  }
                >
                  +
                </Button>
              </Box>
              <Typography className="proposal-input-txt">
                {Number.isNaN(proposalStore.payout)
                  ? "Please input a valid number"
                  : "Input value between 1 to 500 USD"}
              </Typography>
              <Box
                className="proposal-btn-choices"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gridGap: "10px",
                  justifyItems: "center",
                }}
              >
                <span className="proposal-btn-span">
                  <Box className="quote-price-box" onClick={openQuoteModal}>
                    <Tooltip
                      title="Quote Price for Higher"
                      placement="left"
                      disableFocusListener
                      disableTouchListener
                      arrow
                    >
                      <MoneySend
                        color={
                          apiStore.ticks.length === 0 ||
                          contractStore.isProcessing
                            ? "gray"
                            : "green"
                        }
                        size={32}
                      />
                    </Tooltip>
                  </Box>
                  <button
                    className={`proposal-btn-buy ${
                      contractStore.isProcessing ||
                      apiStore.ticks.length === 0 ||
                      proposalStore.payout >= 500.01 ||
                      proposalStore.payout <= 0.99 ||
                      Number.isNaN(proposalStore.payout)
                        ? "processing"
                        : ""
                    } higher `}
                    onClick={() => contractStore.handleBuy(true)}
                    disabled={
                      contractStore.isProcessing ||
                      apiStore.ticks.length === 0 ||
                      proposalStore.payout >= 500.01 ||
                      proposalStore.payout <= 0.99 ||
                      Number.isNaN(proposalStore.payout)
                    }
                  >
                    Higher
                    <NorthEast className="proposal-btn-icon" />
                  </button>
                </span>
                {isQuoteModalOpen && (
                  <Modal open={isQuoteModalOpen} onClose={closeQuoteModal}>
                    <Box
                      sx={{
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.secondary,
                      }}
                      className="quote-price-modal"
                    >
                      <img
                        className="quote-price-img"
                        src={MarketSymbols[id!]}
                        alt={id!}
                      />
                      <Box>
                        <Typography>Contract Type: CALL</Typography>
                        <Typography>{`Payout ${payout} USD for asking price of ${ask_price} USD`}</Typography>
                        <Typography>{longcode}</Typography>
                      </Box>
                    </Box>
                  </Modal>
                )}
                <span className="proposal-btn-span">
                  <Box
                    className="quote-price-box"
                    onClick={openSecondQuoteModal}
                  >
                    <Tooltip
                      title="Quote Price for Lower"
                      placement="left"
                      disableFocusListener
                      disableTouchListener
                      arrow
                    >
                      <MoneyRecive
                        color={
                          apiStore.ticks.length === 0 ||
                          contractStore.isProcessing
                            ? "gray"
                            : "red"
                        }
                        size={32}
                      />
                    </Tooltip>
                  </Box>
                  <button
                    className={`proposal-btn-buy ${
                      contractStore.isProcessing ||
                      apiStore.ticks.length === 0 ||
                      proposalStore.payout >= 500.01 ||
                      proposalStore.payout <= 0.99 ||
                      Number.isNaN(proposalStore.payout)
                        ? "processing"
                        : ""
                    } lower`}
                    onClick={() => contractStore.handleBuy(false)}
                    disabled={
                      contractStore.isProcessing ||
                      apiStore.ticks.length === 0 ||
                      proposalStore.payout >= 500.01 ||
                      proposalStore.payout <= 0.99 ||
                      Number.isNaN(proposalStore.payout)
                    }
                  >
                    Lower
                    <SouthWest className="proposal-btn-icon" />
                  </button>
                </span>
                {isSecondQuoteModalOpen && (
                  <Modal
                    open={isSecondQuoteModalOpen}
                    onClose={closeSecondQuoteModal}
                  >
                    <Box
                      sx={{
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.secondary,
                      }}
                      className="quote-price-modal"
                    >
                      <img
                        className="quote-price-img"
                        src={MarketSymbols[id!]}
                        alt={id!}
                      />
                      <Box>
                        <Typography>Contract Type: PUT</Typography>
                        <Typography>{`Payout ${payout} USD for asking price of ${ask_price} USD`}</Typography>
                        <Typography>{longcode}</Typography>
                      </Box>
                    </Box>
                  </Modal>
                )}
              </Box>
              {authStore.totalAmountWon !== 0 && (
                <Card className="proposal-summary-card">
                  <Box>
                    {contractStore.additionalAmount !== 0 &&
                      contractStore.deductedAmount === 0 && (
                        <Box className="proposal-summary-box">
                          <Typography style={{ color: "green" }}>
                            You Won!
                            <NorthEast />
                          </Typography>
                          <Typography>
                            Profit: +{contractStore.additionalAmount.toFixed(2)}{" "}
                            USD
                          </Typography>
                        </Box>
                      )}
                    <Box className="proposal-summary-total">
                      Total Won: {Number(authStore.totalAmountWon).toFixed(2)}{" "}
                      USD
                    </Box>
                  </Box>
                </Card>
              )}
              {authStore.totalAmountLost !== 0 && (
                <Card className="proposal-summary-card">
                  <div>
                    {contractStore.deductedAmount !== 0 &&
                      contractStore.additionalAmount === 0 && (
                        <Box className="proposal-summary-box">
                          <Typography style={{ color: "red" }}>
                            <SouthEast />
                            You Lost :(
                          </Typography>
                          <Typography>
                            Loss: -{contractStore.deductedAmount.toFixed(2)} USD
                          </Typography>
                        </Box>
                      )}
                    <Box className="proposal-summary-total">
                      Total Lost: {Number(authStore.totalAmountLost).toFixed(2)}{" "}
                      USD
                    </Box>
                  </div>
                </Card>
              )}
              <Box className="trade-history-navbox">
                <Typography
                  className="trade-history-nav"
                  onClick={() => navigate("/trade-history")}
                >
                  See full trade history {">"}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        <Box className="proposal-login-box">
          <Typography variant="body1">
            <a className="proposal-login-link" onClick={authStore.handleOpen}>
              Login
            </a>{" "}
            to start trading
          </Typography>
        </Box>
      )}
    </Box>
  );
});

export default Proposal;
