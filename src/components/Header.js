import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../hooks/connectors";
import { useENS } from "../hooks";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import styled from "@emotion/styled";
import { walletconnect } from "./../hooks/connectors";
import { useLocation } from "react-router-dom";
import { formatETHAddress } from "./../utils/index";
import config from "../utils/config";

const pages = [
  {
    name: "Pool",
    url: "/",
  },
  {
    name: "Deposits",
    url: "/deposits",
  },
];

const Header = (props) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpenDrawer(open);
  };
  const { active, deactivate, account, connector, chainId } = useWeb3React();
  const { ensName, ensAvatar } = useENS(account);

  const [connectorName, setConnectorName] = useState("");

  React.useEffect(() => {
    const getConnector = () => {
      if (!account) return;

      if (connector === injected) {
        setConnectorName("Meta Mask");
      }

      if (connector === walletconnect) {
        setConnectorName("Wallet Connect");
      }
    };
    getConnector();
  }, [account, chainId, connector, active, openDrawer]);

  const disconnect = () => {
    deactivate();
    localStorage.removeItem("connection");
    setOpenDrawer(false);
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
              display: { xs: "flex", md: "flex" },
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            Stable Coin Factory
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
                      location.pathname === page.url ? "contained" : "link"
                    }
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
                <Button variant="link" onClick={toggleDrawer(true)}>
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
                          width: 28,
                          height: 28,
                          marginLeft: 2,
                          marginRight: 1,
                        }}
                      />
                      <Typography component="p" sx={{ fontSize: 12 }}>
                        {ensName || formatETHAddress(account)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Button>

                <Drawer
                  anchor="right"
                  open={openDrawer}
                  onClose={toggleDrawer(false)}
                >
                  <SideDrawer sx={{ p: 2 }}>
                    <ul>
                      <li>
                        <Typography component="h5">Connected From</Typography>
                        <Typography component="p">{connectorName}</Typography>
                      </li>
                      <li>
                        <Typography component="h5">Connected To</Typography>
                        <Typography component="p">{config.network}</Typography>
                      </li>
                      <li>
                        <Typography component="h5">Account Address</Typography>
                        <Typography component="p">
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://bscscan.com/address/${account}`}
                          >
                            {formatETHAddress(account)}
                          </a>
                        </Typography>
                      </li>
                    </ul>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={disconnect}
                      color="error"
                      style={{
                        marginTop: 8,
                        marginBottom: 8,
                      }}
                    >
                      Disconnect Wallet
                    </Button>
                  </SideDrawer>
                </Drawer>
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

const SideDrawer = styled(Box)`
  width: 300px;
  padding: 40px 16px;
  ul {
    list-style-type: none;
    margin: 0;
    margin-bottom: 24px;
    padding: 0;
    li {
      font-size: 14px;
      padding: 8px 0;
      h5 {
        font-weight: 800;
      }
    }
  }
`;

const MenuButton = styled(Button)`
  text-transform: none;
  font-size: 16px;
  color: #fff;
`;

export default Header;
