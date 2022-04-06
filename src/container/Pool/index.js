import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Input from "@mui/material/Input";

import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { ethers } from "ethers";
import { useRecoilValue, useRecoilState } from "recoil";

import config from "../../utils/config";
import { getTokenContract, useControllerContract } from "./../../hooks/index";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";
import styled from "@emotion/styled";
import { CustomModalBox, ContainerBox } from "../../utils/style";
import {
  tvlState,
  nextRewardState,
  scfBalanceState,
  tokenBalanceState,
  selectedTokenState,
  pendingTimeState,
} from "../../utils/states";
import { Alert, Snackbar } from "@mui/material";
import TokenSelection from "../../components/TokenSelection";

const MAX_ALLOWANCE = ethers.BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

const APPROVE_LEAST_AMOUNT = ethers.BigNumber.from("10000000000");

function Pool() {
  const { library, account } = useWeb3React();

  const [tvl, setTvl] = useRecoilState(tvlState);
  const [nextReward, setNextReward] = useRecoilState(nextRewardState);
  const [pendingTime, setPendingTime] = useRecoilState(pendingTimeState);
  const [tokenBalance, setTokenBalance] = useRecoilState(tokenBalanceState);
  const [scfBalance, setSCFBalance] = useRecoilState(scfBalanceState);
  const [allowance, setAllowance] = useState(true);
  const [reload, setReload] = useState(false);
  const [amount, setAmount] = useState(0);

  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setActiveStep(0);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Steppers
  const [activeStep, setActiveStep] = React.useState(0);

  const selectedToken = useRecoilValue(selectedTokenState);

  const controllerContract = useControllerContract();

  useEffect(() => {
    let stale = false;

    const initData = async () => {
      const tokenContract = getTokenContract(
        library,
        config.tokens[selectedToken],
        account
      );

      const scfContract = getTokenContract(
        library,
        config.tokens["SCF"],
        account
      );

      try {
        const token = await tokenContract.balanceOf(account);
        const tokenFormatted = parseFloat(
          formatEther(token.toString())
        ).toFixed(0);
        if (!stale) {
          setTokenBalance(tokenFormatted);
        }
      } catch (e) {
        console.log(e);
      }

      try {
        const scf = await scfContract.balanceOf(account);
        const scfFormatted = parseFloat(formatEther(scf.toString())).toFixed(0);
        if (!stale) {
          setSCFBalance(scfFormatted);
        }
      } catch (e) {
        console.log(e);
      }

      try {
        const tokenAllowance = await tokenContract.allowance(
          account,
          config.controller
        );

        if (!tokenAllowance.gt(APPROVE_LEAST_AMOUNT)) {
          setAllowance(false);
        }
      } catch (e) {
        console.log(e);
      }
    };

    const initStatData = async () => {
      try {
        const pendingBal = await controllerContract.pendingBal(account);
        const pendingTimeVal = await controllerContract.pendingTime(account);

        const nextRewardAmount = parseInt(formatEther(pendingBal));

        setNextReward(nextRewardAmount);
        setPendingTime(parseInt(pendingTimeVal));
      } catch (e) {
        console.log(e);
      }

      try {
        const diffx = 64456;
        const locked = await controllerContract.LOCKED(
          config.tokens[selectedToken]
        );
        const tvlLocked = diffx + parseInt(locked / 1000000);

        setTvl(tvlLocked);
      } catch (e) {
        console.log(e);
      }
    };

    initData();
    initStatData();
    setInterval(() => {
      initStatData();
    }, 20 * 1000);

    return () => {
      stale = true;
    };
    // eslint-disable-next-line
  }, [reload, selectedToken]);

  const approve = async () => {
    const tokenContract = getTokenContract(
      library,
      config.tokens[selectedToken],
      account
    );

    try {
      const tokenAllowance = await tokenContract.allowance(
        account,
        config.controller
      );

      if (tokenAllowance.gt(APPROVE_LEAST_AMOUNT)) {
        setActiveStep(1);
        return;
      }

      const approved = await tokenContract.approve(
        config.controller,
        MAX_ALLOWANCE
      );

      library.once(approved.hash, (done) => {
        if (done.status === 1) {
          setActiveStep(1);
          setNotification({
            show: true,
            type: "success",
            message: `${selectedToken} Approved.`,
          });
        } else {
          setNotification({
            show: true,
            type: "error",
            message: `${selectedToken} approve failed.`,
          });
        }
      });
    } catch (e) {
      setNotification({
        show: true,
        type: "error",
        message: `${selectedToken} approve failed.`,
      });
    }
  };

  const mintSCF = async () => {
    if (amount <= 0) return;

    try {
      const finalAmount = ethers.utils.parseUnits(amount.toString(), 6);

      if (selectedToken === "USDT") {
        const done = await controllerContract.runUSDT(finalAmount, {
          gasLimit: 700000,
        });

        library.once(done.hash, (done) => {
          if (done.status === 1) {
            setNotification({
              show: true,
              type: "success",
              message: `SCF Minted with ${amount} USDT.`,
            });
            setReload(!reload);
          } else {
            setNotification({
              show: true,
              type: "error",
              message: `SCF mint failed.`,
            });
          }
        });
      } else if (selectedToken === "USDC") {
        const done = await controllerContract.runUSDC(finalAmount, {
          gasLimit: 700000,
        });

        library.once(done.hash, (done) => {
          if (done.status === 1) {
            setNotification({
              show: true,
              type: "success",
              message: `SCF Minted with ${amount} USDC.`,
            });
          } else {
            setNotification({
              show: true,
              type: "error",
              message: `SCF mint failed.`,
            });
          }
        });
      }
    } catch (e) {
      setNotification({
        show: true,
        type: "error",
        message: `SCF mint failed.`,
      });
    }
  };

  const claimSCF = async () => {
    try {
      const claimed = await controllerContract.claim({
        gasLimit: 700000,
      });

      library.once(claimed.hash, (done) => {
        if (done.status === 1) {
          setNotification({
            show: true,
            type: "success",
            message: `SCF Claimed.`,
          });
          setReload(!reload);
        } else {
          setNotification({
            show: true,
            type: "error",
            message: `SCF claim failed.`,
          });
        }
      });
    } catch (e) {
      setNotification({
        show: true,
        type: "error",
        message: `SCF claim failed.`,
      });
    }
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification({
      status: false,
      type: "success",
      message: "",
    });
  };

  const steps = [`Approve ${selectedToken}`, "Mint SCF"];

  return (
    <>
      <ContainerBox component="div">
        <TokenSelection />
        <Heading variant="h4" component="h4" align="center">
          Deposit ${selectedToken} to mint $SCF and win rewards
        </Heading>
        <InfoBox>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h5" align="center">
                ${tvl}
              </Typography>
              <Typography variant="p" component="p" align="center">
                Total Value Locked
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h5" align="center">
                ${nextReward}
              </Typography>
              <Typography variant="p" component="p" align="center">
                Your Next Reward
              </Typography>
            </Grid>
          </Grid>
        </InfoBox>

        <InputWrapper>
          <FormControl fullWidth>
            <Input
              id="standard-adornment-amount"
              value={amount}
              type="number"
              color="secondary"
              onChange={(event) => {
                setAmount(event.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              label="Amount"
            />
          </FormControl>
        </InputWrapper>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EntryBox>
              <Typography variant="b" component="b" align="center">
                {selectedToken} Balance
              </Typography>
              <Typography variant="p" component="p" align="center">
                {tokenBalance} {selectedToken}
              </Typography>
            </EntryBox>
            <EntryBox>
              <Typography variant="b" component="b" align="center">
                SCF Balance
              </Typography>
              <Typography variant="p" component="p" align="center">
                {scfBalance} SCF
              </Typography>
            </EntryBox>
            <MintButton
              fullWidth
              variant="contained"
              onClick={() => {
                if (allowance) {
                  mintSCF();
                } else {
                  handleOpen();
                }
              }}
            >
              Mint SCF with {selectedToken}
            </MintButton>
            {pendingTime !== 0 && nextReward > 0 ? (
              <ClaimButton
                fullWidth
                variant="contained"
                onClick={() => {
                  claimSCF();
                }}
              >
                Claim SCF token
              </ClaimButton>
            ) : (
              <></>
            )}

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <CustomModalBox>
                <StepperBox activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </StepperBox>
                {activeStep === 0 ? (
                  <React.Fragment>
                    <MintButton
                      onClick={approve}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Approve {selectedToken}
                    </MintButton>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <MintButton
                      onClick={mintSCF}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Mint SCF with {selectedToken}
                    </MintButton>
                  </React.Fragment>
                )}
              </CustomModalBox>
            </Modal>
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={notification.show}
          autoHideDuration={5000}
          onClose={handleNotificationClose}
        >
          <Alert
            onClose={handleNotificationClose}
            severity={notification.type}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </ContainerBox>
    </>
  );
}

const EntryBox = styled.div`
  padding: 8px 16px;
  background: rgba(15, 15, 15, 0.2);
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
`;

const MintButton = styled(Button)`
  height: 70px;
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 8px 0 !important;
  background-image: linear-gradient(
    to right,
    #f3904f 0%,
    #3b4371 51%,
    #f3904f 100%
  );

  transition: 0.5s;
  background-size: 200% auto;
  box-shadow: 0 0 10px #333;
  border-radius: 10px;
  display: block;
  text-transform: none;

  &:hover {
    background-position: right center; /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
  }
`;

const ClaimButton = styled(Button)`
  height: 70px;
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 8px 0 !important;
  background-image: linear-gradient(
    to right,
    #6612d9 0%,
    #3b4371 51%,
    #6612d9 100%
  );

  transition: 0.5s;
  background-size: 200% auto;
  box-shadow: 0 0 10px #333;
  border-radius: 10px;
  display: block;
  text-transform: none;

  &:hover {
    background-position: right center; /* change the direction of the change here */
    color: #fff;
    text-decoration: none;
  }
`;

const Heading = styled(Typography)`
  margin: 36px 0;
  font-weight: 700;
`;

const InfoBox = styled.div`
  background: rgba(15, 15, 15, 0.2);
  border-radius: 10px;
  padding: 24px 8px;
  margin-bottom: 24px;
  h5 {
    font-weight: 700;
    font-size: 32px;
    color: #fed330;
  }
  p {
    font-size: 14px;
    color: #e3e3e3;
  }
`;

const StepperBox = styled(Stepper)`
  padding: 24px 0;
`;

const InputWrapper = styled.div`
  margin: 24px 0;
  background: rgba(15, 15, 15, 0.2);
  border-radius: 10px;
  overflow: hidden;

  #standard-adornment-amount {
    padding: 16px 8px;
    font-size: 28px;
    font-weight: 600;
    border: 0 !important;
  }

  .MuiInputAdornment-root p {
    font-size: 24px;
    color: #fed330;
    padding-left: 16px;
  }

  .MuiInput-root::before,
  .MuiInput-root::after {
    display: none;
  }
`;

export default Pool;
