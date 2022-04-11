import React from "react";
import Container from "@mui/material/Container";

import Header from "../components/Header";
import Web3Wrapper from "./../components/Web3Wrapper";
import { Route, Routes } from "react-router-dom";
import Pool from "./Pool";
import Deposits from "./Deposits/index";
import BottomNav from "./../components/BottomNav";
import Rewards from "./Rewards";
import styled from "@emotion/styled";

const Home = () => {
  return (
    <>
      <Header />
      <StyledContainer maxWidth="md">
        <Web3Wrapper>
          <Routes>
            <Route exact path="/" element={<Pool />} />
            <Route exact path="/deposits" element={<Deposits />} />
            <Route exact path="/rewards" element={<Rewards />} />
          </Routes>
        </Web3Wrapper>
      </StyledContainer>
      <BottomNav />
    </>
  );
};

const StyledContainer = styled(Container)`
  padding-bottom: 120px;
`;

export default Home;
