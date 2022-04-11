import { atom } from "recoil";

export const usdtTvlState = atom({
  key: "usdtTvl",
  default: 0,
});

export const usdcTvlState = atom({
  key: "usdcTvl",
  default: 0,
});

export const epochBonusState = atom({
  key: "epochBonus",
  default: 0,
});

export const nextRewardState = atom({
  key: "nextReward",
  default: 0,
});

export const nextRewardTokenState = atom({
  key: "nextRewardToken",
  default: 0,
});

export const pendingTimeState = atom({
  key: "pendingTime",
  default: -1,
});

export const usdtBalanceState = atom({
  key: "usdtBalance",
  default: 0,
});

export const usdcBalanceState = atom({
  key: "usdcBalance",
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

export const rewardsState = atom({
  key: "rewards",
  default: [],
});

export const selectedTokenState = atom({
  key: "selectedToken",
  default: "USDT",
});
