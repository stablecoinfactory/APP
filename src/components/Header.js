import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useWeb3React } from "@web3-react/core";
import { useENS } from "../hooks";
import { Avatar, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";
import { formatETHAddress } from "./../utils/index";
import IconButton from "@mui/material/IconButton";

import LogoutIcon from "@mui/icons-material/Logout";
const pages = [
  {
    name: "Pool",
    url: "/",
  },
  {
    name: "Deposits",
    url: "/deposits",
  },
  {
    name: "Rewards",
    url: "/rewards",
  },
];

const Header = (props) => {
  const { active, deactivate, account, chainId } = useWeb3React();
  const { ensName, ensAvatar } = useENS(account);

  const [connectorName, setConnectorName] = useState("");

  React.useEffect(() => {
    const getConnector = () => {
      if (!account) return;
      const connectionName = localStorage.getItem("connection");
      setConnectorName(connectionName);
    };
    getConnector();
  }, [account, chainId, active]);

  const disconnect = () => {
    deactivate();
    localStorage.removeItem("connection");
  };

  const location = useLocation();

  return (
    <AppBar
      position="static"
      style={{ boxShadow: "none", padding: 8 }}
      color="transparent"
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              fontSize: 24,
              color: "#191919",
            }}
          >
            STABLE COIN FACTORY
          </Typography>
          <Typography
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: 700,
              fontSize: 18,
              color: "#191919",
            }}
          >
            STABLE COIN FACTORY
          </Typography>
          {active ? (
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
              }}
            >
              {pages.map((page) => (
                <Link key={JSON.stringify(page)} to={page.url}>
                  <MenuButton
                    variant={
                      location.pathname === page.url ? "outlined" : "link"
                    }
                    fullWidth
                    color="secondary"
                    key={page.name}
                    sx={{
                      my: 2,
                      mx: 2,
                    }}
                  >
                    {page.name}
                  </MenuButton>
                </Link>
              ))}
            </Box>
          ) : (
            <></>
          )}

          <Box sx={{ flexGrow: 0 }}>
            {active ? (
              <Grid
                container
                direction="row"
                justifyContent="left"
                alignItems="center"
              >
                <Grid justifyContent="left" alignItems="center">
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    display="flex"
                    alignItems="center"
                  >
                    <Avatar
                      src={
                        ensAvatar
                          ? ensAvatar
                          : `https://avatars.dicebear.com/v2/male/${account}.svg`
                      }
                      sx={{
                        width: 32,
                        height: 32,
                        marginLeft: 2,
                        marginRight: 2,
                      }}
                    />
                    <div>
                      <Grid
                        container
                        direction="column"
                        justifyContent="start"
                        display="flex"
                        alignItems="start"
                      >
                        <Typography component="p" sx={{ fontSize: 12 }}>
                          {ensName || formatETHAddress(account)}
                        </Typography>

                        <Chip
                          label={connectorName}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    </div>

                    <IconButton
                      onClick={disconnect}
                      color="error"
                      style={{
                        marginTop: 8,
                        marginBottom: 8,
                        marginLeft: 8,
                      }}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <Button color="success" variant="outlined">
                Connect Your Wallet
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const MenuButton = styled(Button)`
  text-transform: none;
  font-size: 16px;
`;

export default Header;
