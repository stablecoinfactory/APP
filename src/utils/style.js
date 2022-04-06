import Box from "@mui/material/Box";
import styled from "@emotion/styled";

export const CustomModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 400px;
  background: #2c2c54;
  padding: 48px;
  border-radius: 10px;

  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
`;

export const ContainerBox = styled(Box)`
  padding: 24px;
  flex-grow: 1;
  border-radius: 8px;
  margin: 36px 4px;
  background-color: #2c2c54;

  background-image: radial-gradient(
    circle farthest-corner at 10% 50%,
    #2c3c60 10%,
    #2c1c50 90%
  );

  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
`;
