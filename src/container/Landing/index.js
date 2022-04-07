import { useWeb3React } from "@web3-react/core";
import { getErrorMessage } from "./../../hooks/web3";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Connection from "../../components/Connection";
import Modal from "@mui/material/Modal";
import React from "react";
import styled from "@emotion/styled";
import LandingPng from "../../images/landing.png";

const Landing = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { error } = useWeb3React();

  const { connectorsByName, activate, setActivatingConnector } = props;

  return (
    <LandingBox>
      <Grid container direction="column" justify="center" alignItems="center">
        <LandingImage src={LandingPng} alt="money-tree" />
        <Typography
          className="landing-text"
          variant="h5"
          gutterBottom
          align="center"
        >
          Automated algorithmic collateralization platform built for stable
          dollar cryptocurrencies.
        </Typography>
        <div>
          <ConnectButton
            variant="outlined"
            color="success"
            onClick={handleOpen}
          >
            Connect Your Wallet
          </ConnectButton>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Connection
              connectorsByName={connectorsByName}
              activate={activate}
              setActivatingConnector={setActivatingConnector}
            />
          </Modal>
        </div>
        <div>
          {!!error && (
            <Alert severity="warning">
              <div
                dangerouslySetInnerHTML={{ __html: getErrorMessage(error) }}
              />
            </Alert>
          )}
        </div>
      </Grid>
    </LandingBox>
  );
};

const LandingBox = styled.div`
  margin: 80px 0;
`;

const LandingImage = styled.img`
  max-width: 650px;
  border: 0;
`;

const ConnectButton = styled(Button)`
  margin: 16px 0;
  height: 60px;
  padding: 8px 24px;
`;

export default Landing;
