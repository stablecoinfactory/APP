import { useWeb3React } from "@web3-react/core";
import { useMemo, useEffect, useState } from "react";
import config from "../utils/config";
import controllerAbi from "../utils/abis/controller.json";
import busdAbi from "../utils/abis/busd.json";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";

export function useControllerContract() {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    try {
      return new Contract(
        config.controller,
        controllerAbi,
        library.getSigner(account).connectUnchecked()
      );
    } catch (error) {
      console.error("Contract error.", error);
      return null;
    }
  }, [library, account]);
}

export function getTokenContract(library, address, account) {
  return new Contract(
    address,
    busdAbi,
    library.getSigner(account).connectUnchecked()
  );
}

export function useENS(address) {
  const [ensName, setENSName] = useState(null);
  const [ensAvatar, setENSAvatar] = useState(null);

  useEffect(() => {
    const resolveENS = async () => {
      if (address) {
        const provider = await getDefaultProvider();
        const ensName = await provider.lookupAddress(address);
        const resolver = await provider.getResolver(ensName ?? "");
        const ensAvatar = await resolver?.getAvatar();
        setENSAvatar(ensAvatar?.url);
        setENSName(ensName);
      }
    };
    resolveENS();
  }, [address]);

  return { ensName, ensAvatar };
}
