import { atom } from "recoil";

export const tvlState = atom({
  key: "tvl",
  default: 0,
});

export const nextRewardState = atom({
  key: "nextReward",
  default: 0,
});

export const pendingTimeState = atom({
  key: "pendingTime",
  default: 0,
});

export const tokenBalanceState = atom({
  key: "tokenBalance",
  default: 0,
});

export const scfBalanceState = atom({
  key: "scfBalance",
  default: 0,
});

export const depositsState = atom({
  key: "deposits",
  default: [],
});

export const selectedTokenState = atom({
  key: "selectedToken",
  default: "USDT",
});
