import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { injected, walletconnect } from "../hooks/connectors";
import { useEagerConnect, useInactiveListener } from "../hooks/web3";
import Landing from "../container/Landing/index";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const connectorsByName = {
  "Meta Mask": injected,
  "Trust Wallet": injected,
  "Wallet Connect": walletconnect,
};

function Web3Wrapper({ children }) {
  const { connector, activate, active, chainId } = useWeb3React();

  const [activatingConnector, setActivatingConnector] = useState(true);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(false);
    } else {
      setTimeout(() => {
        if (!active) {
          setActivatingConnector(false);
        }
      }, 600);
    }
  }, [activatingConnector, active, connector, setActivatingConnector]);

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager || !!activatingConnector);

  if (triedEager && active && chainId !== undefined) {
    return children;
  }

  if (activatingConnector) {
    return (
      <Typography align="center" style={{ margin: 24 }}>
        <CircularProgress />
      </Typography>
    );
  }

  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Landing
              connectorsByName={connectorsByName}
              activate={activate}
              setActivatingConnector={setActivatingConnector}
            />
          }
        />
      </Routes>
    </>
  );
}

export default Web3Wrapper;
