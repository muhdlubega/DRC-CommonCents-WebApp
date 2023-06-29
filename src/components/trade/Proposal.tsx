import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/main.scss";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Typography } from '@mui/material';
import apiStore from "../../store/ApiStore";
import authStore from "../../store/AuthStore";
import { observer } from "mobx-react-lite";
import { auth, db } from "../../firebase";

const Proposal = observer(() => {
  const { id } = useParams<{ id: string }>();
  const proposalContainerRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(event.target.value, 10);
    apiStore.setDuration(newDuration);
    // apiStore.subscribeProposal();
  };

  const handlePayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e', event.target.value);
    
    const newPayout = parseInt(event.target.value);
    apiStore.setPayout(newPayout);
    // apiStore.subscribeProposal();
  };

  const handleBuy = async (isHigher: boolean) => {
    setIsProcessing(true); 
    let balance = 0;
    try {
      // const balanceSnapshot = await getDoc(authStore.userDocRef);
      // if (!balanceSnapshot.exists()) {
      //   console.log("Balance document does not exist");
      //   return;
      // }
      // const balanceData = balanceSnapshot.data();
      // if (!balanceData || typeof balanceData.balance !== "number") {
      //   console.log("Invalid balance data");
      //   return;
      // }
      const balanceSnapshot = await getDocs(collection(db, "users"));
      balanceSnapshot.forEach((doc) => {
        if (auth.currentUser!.uid == doc.id) {
          balance = doc.data().balance || null;
        }
      });
      const currentBalance = balance;

      const payoutValue = parseInt(apiStore.payout.toString(), 10);

      console.log(payoutValue);
      console.log(currentBalance);

      if (currentBalance < payoutValue) {
        console.log("Insufficient balance");
        return;
      }

      const newBalance = currentBalance - payoutValue;
      authStore.setBalance(newBalance);
      // await setDoc(authStore.userDocRef, { balance: newBalance });

      setTimeout(() => handleSell(isHigher), apiStore.duration * 1000);

      console.log("Buy successful");
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }
  };

  const handleSell = async (isHigher: boolean) => {
    setIsProcessing(true); 
    let balance = 0;
    try {
      const balanceSnapshot = await getDocs(collection(db, "users"));
      balanceSnapshot.forEach((doc) => {
        if (auth.currentUser!.uid == doc.id) {
          balance = doc.data().balance || null;
        }
      });
      // const balanceSnapshot = await getDoc(authStore.userDocRef);
      // if (!balanceSnapshot.exists()) {
      //   console.log("Balance document does not exist");
      //   return;
      // }
      // const balanceData = balanceSnapshot.data();
      // if (!balanceData || typeof balanceData.balance !== "number") {
      //   console.log("Invalid balance data");
      //   return;
      // }
      const currentBalance = balance;

      const payoutValue = parseInt(apiStore.payout.toString(), 10);

      console.log("payout/stake", payoutValue);
      console.log("balance", currentBalance);
      console.log("proposal data", apiStore.proposalData);

      if (apiStore.proposalData.length > 0) {
        console.log(
          "testing",
          apiStore.proposalData[
            apiStore.proposalData.length - apiStore.duration
          ]
        );
        const previousSpot =
          apiStore.proposalData[
            apiStore.proposalData.length - apiStore.duration
          ].spot;
        const currentSpot =
          apiStore.proposalData[apiStore.proposalData.length - 1].spot;

          console.log("prev", previousSpot);
          console.log("next", currentSpot);
          
          
          const additionalAmount =
          apiStore.proposalData[
            apiStore.proposalData.length - apiStore.duration
          ].payout;

        if (previousSpot && currentSpot) {
          const previousSpotValue = previousSpot;
          const currentSpotValue = currentSpot;

          console.log("previous spot:", previousSpotValue);
          console.log("current spot:", currentSpotValue);

          if (isHigher) {
            if (currentSpotValue > previousSpotValue) {
              const updatedBalance = currentBalance + additionalAmount;
              authStore.setBalance(updatedBalance);
              // await setDoc(authStore.userDocRef, { balance: updatedBalance });
              console.log("Sell successful", additionalAmount);
              apiStore.setSellSuccessful(true);
              apiStore.setAdditionalAmount(additionalAmount);
              apiStore.setTotalAmountWon(apiStore.totalAmountWon + additionalAmount); 
            } else {
              console.log("Spot is not higher", additionalAmount);
              apiStore.setSellFailed(true);
              apiStore.setDeductedAmount(payoutValue);
              apiStore.setTotalAmountLost(apiStore.totalAmountLost + payoutValue);
            }
          } else {
            if (previousSpotValue > currentSpotValue) {
              const additionalAmount =
                apiStore.proposalData[
                  apiStore.proposalData.length - apiStore.duration
                ].payout;
              const updatedBalance = currentBalance + additionalAmount;
              authStore.setBalance(updatedBalance);
              // await setDoc(authStore.userDocRef, { balance: updatedBalance });
              console.log("Sell successful");
              apiStore.setSellSuccessful(true);
              apiStore.setAdditionalAmount(additionalAmount);
              apiStore.setTotalAmountWon(apiStore.totalAmountWon + additionalAmount); 
            } else {
              console.log("Spot is not lower", additionalAmount);
              apiStore.setSellFailed(true);
              apiStore.setDeductedAmount(payoutValue);
              apiStore.setTotalAmountLost(apiStore.totalAmountLost + payoutValue);
            }
          }
        } else {
          console.log("Previous spot or current spot is not available");
        }
      } else {
        console.log("Not enough data to compare spot prices");
      }
      setIsProcessing(false);
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }
  };

  // useEffect(() => {
  //   apiStore.getProposal(id!);
  // }, []);

  useEffect(() => {

    if (id) {
        apiStore.getProposal(id);
      // const proposal = document.querySelector<HTMLButtonElement>("#proposal");
      // proposal?.addEventListener("click", () => apiStore.getProposal(id));

      // const proposal_unsubscribe = document.querySelector<HTMLButtonElement>(
      //   "#proposal-unsubscribe"
      // );
      // proposal_unsubscribe?.addEventListener(
      //   "click",
      //   apiStore.unsubscribeProposal
      // );

      // return () => {
      //   proposal?.removeEventListener("click", () => apiStore.getProposal(id));
      //   proposal_unsubscribe?.removeEventListener(
      //     "click",
      //     apiStore.unsubscribeProposal
      //   );
      // };
    }
  }, [id, apiStore.payout, apiStore.duration]);

  return (
    <Box>
      <Box className="proposal-btn-group">
        <Button
          style={{
            backgroundColor: apiStore.basis === 'payout' ? 'blue' : 'white',
            color: apiStore.basis === 'payout' ? 'white' : 'blue',
          }}
          className="proposal-options"
          onClick={() => apiStore.setBasis('payout')}
        >
          Payout
        </Button>
        <Button
          style={{
            backgroundColor: apiStore.basis === 'stake' ? 'blue' : 'white',
            color: apiStore.basis === 'stake' ? 'white' : 'blue',
          }}
          className="proposal-options"
          onClick={() => apiStore.setBasis('stake')}
        >
          Stake
        </Button>
      </Box>
      <Box>
        <Typography component="span">Set Price: </Typography>
        <input type="number" value={apiStore.payout} onChange={handlePayoutChange} min="1" max="500" />
        <Typography component="span">Input number between 1 and 500</Typography>
      </Box>
      <Box>
        <Typography component="span">Ticks: </Typography>
        <input
          type="range"
          min="1"
          max="10"
          value={apiStore.duration}
          onChange={handleDurationChange}
        />
      </Box>
      
      <Box ref={proposalContainerRef} id="proposalContainer"></Box>
      <Box className="proposal-btn-group">
        <Button
          className={`proposal-btn-higher ${isProcessing ? 'processing' : ''}`}
          onClick={() => handleBuy(true)}
          disabled={isProcessing}
        >
          Higher
        </Button>
        <Button
          className={`proposal-btn-lower ${isProcessing ? 'processing' : ''}`}
          onClick={() => handleBuy(false)}
          disabled={isProcessing}
        >
          Lower
        </Button>
      </Box>
      <Box>
        {apiStore.sellSuccessful && (
          <div>
            <div>Won {apiStore.additionalAmount.toFixed(2)} USD</div>
            <div>Total Won: {apiStore.totalAmountWon.toFixed(2)} USD</div>
          </div>
        )}
      </Box>
      <Box>
        {apiStore.sellFailed && (
          <div>
            <div>Lost {apiStore.deductedAmount.toFixed(2)} USD</div>
            <div>Total Lost: {apiStore.totalAmountLost.toFixed(2)} USD</div>
          </div>
        )}
      </Box>
    </Box>
  );
});

export default Proposal;