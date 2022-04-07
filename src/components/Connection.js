import React from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import MetaMaskImage from "../images/metamask.png";
import WalletConnectImage from "../images/walletconnect.png";
import TrustWalletImage from "../images/trustwallet.png";

import { Avatar } from "@mui/material";
import { CustomModalBox } from "./../utils/style";
import styled from "@emotion/styled";

const Connection = (props) => {
  const { connectorsByName, activate, setActivatingConnector } = props;

  const activateWallet = async (currentConnector, name) => {
    setActivatingConnector(currentConnector);
    await activate(connectorsByName[name]);
    window.localStorage.setItem("connection", name);
  };

  return (
    <CustomModalBox>
      <Typography variant="h5" gutterBottom align="center">
        Choose Your Wallet
      </Typography>
      <Grid container spacing={2} style={{ marginTop: 24 }}>
        {Object.keys(connectorsByName).map((name) => {
          const currentConnector = connectorsByName[name];
          const Image =
            name === "Meta Mask"
              ? MetaMaskImage
              : name === "Trust Wallet"
              ? TrustWalletImage
              : WalletConnectImage;
          return (
            <Grid item xs={12} key={name}>
              <ConnectorButton
                fullWidth
                variant="outlined"
                startIcon={<Avatar src={Image} />}
                onClick={() => {
                  activateWallet(currentConnector, name);
                }}
              >
                {name}
              </ConnectorButton>
            </Grid>
          );
        })}
      </Grid>
    </CustomModalBox>
  );
};

const ConnectorButton = styled(Button)`
  font-weight: 700;
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  .MuiButton-startIcon {
    padding-right: 8px;
  }
`;

export default Connection;
