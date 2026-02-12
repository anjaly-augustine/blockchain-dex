import React, { useState } from "react";
import { useEthers, useContractFunction } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import AMMDexAbi from "@my-app/contracts/src/abis/AMMDex.json";
import { DEX_ADDRESS } from "../config";

const Exchange = () => {
  const { account } = useEthers();
  const [amount, setAmount] = useState("");

  const ammContract = new Contract(DEX_ADDRESS, AMMDexAbi);

  const { state, send } = useContractFunction(
    ammContract,
    "swapXtoY",
    { transactionName: "Swap X to Y" }
  );

  const handleSwap = () => {
    if (!amount || !account) return;

    const amountIn = utils.parseUnits(amount, 18);
    send(amountIn);
  };

  return (
    <div style={{ color: "white" }}>
      <h3>Swap Token X → Token Y</h3>

      <input
        type="text"
        placeholder="Amount of Token X"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <button onClick={handleSwap}>
        Swap
      </button>

      {state.status === "Mining" && <p>Transaction Pending...</p>}
      {state.status === "Success" && <p>Swap Successful </p>}
      {state.status === "Exception" && <p>Transaction Failed </p>}
    </div>
  );
};

export default Exchange;
