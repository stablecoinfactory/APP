import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Input from "@mui/material/Input";
import dayjs from "dayjs";
import FormControl from "@mui/material/FormControl";
import { ethers } from "ethers";
import { useRecoilValue, useRecoilState } from "recoil";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import config from "../../utils/config";
import { getTokenContract, useControllerContract } from "./../../hooks/index";
import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";
import styled from "@emotion/styled";
import { CustomModalBox, ContainerBox } from "../../utils/style";
import {
  usdtTvlState,
  nextRewardState,
  scfBalanceState,
  usdtBalanceState,
  selectedTokenState,
  pendingTimeState,
  usdcBalanceState,
  usdcTvlState,
} from "../../utils/states";
import { Alert, Snackbar } from "@mui/material";
import TokenSelection from "../../components/TokenSelection";

const MAX_ALLOWANCE = ethers.BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);
dayjs.extend(duration);
dayjs.extend(relativeTime);
const APPROVE_LEAST_AMOUNT = ethers.BigNumber.from("10000000000");

function Pool() {
  const { library, account } = useWeb3React();

  const [usdtTvl, setUsdtTvl] = useRecoilState(usdtTvlState);
  const [usdcTvl, setUsdcTvl] = useRecoilState(usdcTvlState);
  const [nextReward, setNextReward] = useRecoilState(nextRewardState);
  const [pendingTime, setPendingTime] = useRecoilState(pendingTimeState);
  const [usdtBalance, setUsdtBalance] = useRecoilState(usdtBalanceState);
  const [usdcBalance, setUsdcBalance] = useRecoilState(usdcBalanceState);
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

      const usdtContract = getTokenContract(
        library,
        config.tokens["USDT"],
        account
      );

      const usdcContract = getTokenContract(
        library,
        config.tokens["USDC"],
        account
      );

      const scfContract = getTokenContract(
        library,
        config.tokens["SCF"],
        account
      );

      try {
        const tokenAllowance = await tokenContract.allowance(
          account,
          config.controller
        );

        if (!tokenAllowance.gt(APPROVE_LEAST_AMOUNT) && !stale) {
          setAllowance(false);
        }
      } catch (e) {
        console.log(e);
      }

      try {
        const usdtLocked = await controllerContract.LOCKED(
          config.tokens["USDT"]
        );
        const usdtTvlLocked = parseInt(usdtLocked / 1000000);

        if (!stale) setUsdtTvl(usdtTvlLocked);

        const usdcLocked = await controllerContract.LOCKED(
          config.tokens["USDC"]
        );
        const usdcTvlLocked = parseInt(usdcLocked / 1000000);

        if (!stale) setUsdcTvl(usdcTvlLocked);
      } catch (e) {
        console.log(e);
      }

      try {
        const token = await usdtContract.balanceOf(account);
        const tokenFormatted = parseFloat(
          formatEther(token.toString())
        ).toFixed(4);
        if (!stale) setUsdtBalance(tokenFormatted);
      } catch (e) {
        console.log(e);
      }

      try {
        const token = await usdcContract.balanceOf(account);
        const tokenFormatted = parseFloat(
          formatEther(token.toString())
        ).toFixed(4);
        if (!stale) setUsdcBalance(tokenFormatted);
      } catch (e) {
        console.log(e);
      }

      try {
        const scf = await scfContract.balanceOf(account);
        const scfFormatted = parseFloat(formatEther(scf.toString())).toFixed(4);
        if (!stale) {
          setSCFBalance(scfFormatted);
        }
      } catch (e) {
        console.log(e);
      }

      try {
        const pendingBal = await controllerContract.pendingBal(account);
        const pendingTimeVal = parseInt(
          await controllerContract.pendingTime(account)
        );

        const nextRewardAmount = parseInt(formatEther(pendingBal));

        if (!stale) setNextReward(nextRewardAmount);

        const currentTimeVal = Math.round(new Date().getTime() / 1000);
        let inTime = pendingTimeVal - currentTimeVal;
        if (!stale) setPendingTime(inTime);
      } catch (e) {
        console.log(e);
      }
    };

    initData();

    return () => {
      stale = true;
    };
    // eslint-disable-next-line
  }, [reload, selectedToken, account]);

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
        <Heading
          variant="h4"
          component="h4"
          align="center"
          sx={{ fontSize: 30, color: "#222" }}
        >
          <p>Mint $SCF using $USDT or $USDC</p>{" "}
        </Heading>
        <InfoBox>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h5" component="h5" align="center">
                ${usdtTvl}
              </Typography>
              <Typography variant="p" component="p" align="center">
                USDT TVL
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="h5" align="center">
                ${usdcTvl}
              </Typography>
              <Typography variant="p" component="p" align="center">
                USDC TVL
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="h5" align="center">
                {nextReward} SCF
              </Typography>
              <Typography variant="p" component="p" align="center">
                Your Next Reward
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h5" component="h5" align="center">
                {pendingTime < 0
                  ? "Right Now"
                  : dayjs.duration({ seconds: pendingTime }).humanize(true)}
              </Typography>
              <Typography variant="p" component="p" align="center">
                Claimable
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
              endAdornment={<TokenSelection />}
              label="Amount"
            />
          </FormControl>
        </InputWrapper>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <EntryBox>
              <Typography variant="p" component="p" align="center">
                {usdtBalance} <b>USDT</b>
              </Typography>
              <Typography variant="p" component="p" align="center">
                {usdcBalance} <b>USDC</b>
              </Typography>
              <Typography variant="p" component="p" align="center">
                {scfBalance} <b>SCF</b>
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
            {nextReward > 0 && pendingTime < 0 ? (
              <ClaimButton
                fullWidth
                variant="contained"
                color="secondary"
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
  border-radius: 4px;
  display: flex;
  justify-content: center;
  p {
    padding: 0 16px;
  }
`;

const MintButton = styled(Button)`
  height: 80px;
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 8px 0 !important;
  color: #fff;
  border-radius: 40px;
`;

const ClaimButton = styled(Button)`
  height: 80px;
  font-size: 16px;
  font-weight: 600;
  margin: 24px 0 8px 0 !important;
  color: #fff;
  border-radius: 40px;
`;

const Heading = styled(Typography)`
  margin: 36px 0;
  font-weight: 700;
  padding: 0;
  p {
    padding: 0;
    margin: 16px 0;
  }
`;

const InfoBox = styled.div`
  padding: 24px 8px;
  margin-bottom: 24px;
  h5 {
    font-weight: 600;
    font-size: 30px;
    color: #5352ed;
  }
  p {
    margin-top: 4px;
    font-size: 15px;
    color: #555;
  }
`;

const StepperBox = styled(Stepper)`
  padding: 24px 0;
`;

const InputWrapper = styled.div`
  margin: 24px 0;
  border: 3px solid #e3e3e3;
  border-radius: 40px;
  overflow: hidden;
  background: #fff;

  #standard-adornment-amount {
    padding: 24px;
    font-size: 30px;
    font-weight: 600;
    border: 0 !important;
  }

  .MuiInput-root::before,
  .MuiInput-root::after {
    display: none;
  }
`;

export default Pool;
