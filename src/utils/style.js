import Box from "@mui/material/Box";
import styled from "@emotion/styled";

export const CustomModalBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 400px;
  background: #fff;
  padding: 48px;
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
    rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
`;

export const ContainerBox = styled(Box)`
  flex-grow: 1;
  padding: 32px;
  margin: 40px;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;

  @media (max-width: 780px) {
    padding: 16px;
    margin: 40px 0;
  }
`;
