import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { ContainerBox } from "../../utils/style";
import { formatETHAddress } from "../../utils/index";
import config from "../../utils/config";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedTokenState, depositsState } from "../../utils/states";
import { formatEther } from "@ethersproject/units";

function Deposits() {
  const [deposits, setDeposits] = useRecoilState(depositsState);

  const selectedToken = useRecoilValue(selectedTokenState);

  useEffect(() => {
    let stale = false;
    const initData = async () => {
      try {
        let depositsList = await axios({
          url: config.thegraph,
          method: "post",
          data: {
            query: `{
              deposits(first: 10, orderDirection: desc) {
                id
                token
                address
                amount
              }
            }`,
          },
        }).then((res) => res.data.data.deposits);

        depositsList = depositsList.map((item) => {
          if (
            item.token.toLowerCase() === config.tokens["USDT"].toLowerCase()
          ) {
            item.tokenName = "USDT";
          }
          if (
            item.token.toLowerCase() === config.tokens["USDC"].toLowerCase()
          ) {
            item.tokenName = "USDC";
          }
          item.amount = parseFloat(formatEther(item.amount)).toFixed(4);
          return item;
        });

        if (!stale) {
          setDeposits(depositsList);
        }
      } catch (e) {
        console.log(e);
      }
    };
    initData();
    return () => {
      stale = true;
    };
    // eslint-disable-next-line
  }, [selectedToken]);

  return (
    <>
      <ContainerBox>
        <TableContainer component={Paper} color="transparent">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Address</b>
                </TableCell>
                <TableCell align="center">
                  <b>Coin</b>
                </TableCell>
                <TableCell align="right">
                  <b>Deposit Amount</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deposits.map((row) => (
                <TableRow
                  key={JSON.stringify(row)}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <a
                      href={`https://www.bscscan.com/address/${row.address}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {formatETHAddress(row.address)}
                    </a>
                  </TableCell>
                  <TableCell align="center">{row.tokenName}</TableCell>
                  <TableCell align="right">{row.amount} SCF</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ContainerBox>
    </>
  );
}

export default Deposits;
