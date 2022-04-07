import * as React from "react";

import Grid from "@mui/material/Grid";
import { useRecoilState } from "recoil";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import usdtImage from "../images/usdt.png";
import usdcImage from "../images/usdc.png";

import { selectedTokenState } from "../utils/states";

export default function TokenSelection() {
  const [selectedToken, setSelectedToken] = useRecoilState(selectedTokenState);

  const changeToken = (_, newToken) => {
    if (newToken) {
      setSelectedToken(newToken);
    }
  };
  return (
    <Grid justifyContent="center" alignItems="end" style={{ marginRight: 16 }}>
      <FormControl style={{ textAlign: "center" }}>
        <ToggleButtonGroup
          color="primary"
          value={selectedToken}
          onChange={changeToken}
          exclusive
        >
          <ToggleButton value="USDT">
            <img
              height="28"
              style={{ marginRight: 8 }}
              src={usdtImage}
              alt="USDT"
            />
            <Typography variant="p" component="p">
              USDT
            </Typography>
          </ToggleButton>

          <ToggleButton value="USDC">
            <img
              height="28"
              style={{ marginRight: 8 }}
              src={usdcImage}
              alt="USDC"
            />
            <Typography variant="p" component="p">
              USDC
            </Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </FormControl>
    </Grid>
  );
}
