import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import WavesIcon from "@mui/icons-material/Waves";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import styled from "@emotion/styled";
import { useWeb3React } from "@web3-react/core";
const pages = [
  {
    name: "Pool",
    url: "/",
    icon: <WavesIcon />,
  },
  {
    name: "Deposits",
    url: "/deposits",
    icon: <PlaylistAddIcon />,
  },
  {
    name: "Rewards",
    url: "/rewards",
    icon: <EmojiEventsIcon />,
  },
];

export default function BottomNav() {
  const { active } = useWeb3React();

  const [value, setValue] = React.useState(0);

  const navigate = useNavigate();

  return (
    <Box sx={{ display: { xs: "flex", md: "none" } }}>
      {active ? (
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={4}
        >
          <BottomBar
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              navigate(pages[newValue].url);
            }}
          >
            {pages.map((page) => (
              <BottomNavigationAction
                key={JSON.stringify(page)}
                label={page.name}
                icon={page.icon}
              />
            ))}
          </BottomBar>
        </Paper>
      ) : null}
    </Box>
  );
}

const BottomBar = styled(BottomNavigation)`
  background: #e9e9e9;
`;
