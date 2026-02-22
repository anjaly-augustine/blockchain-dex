import React, { useState } from "react";
import { useEthers, useContractFunction } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import AMMDexAbi from "@my-app/contracts/src/abis/AMMDex.json";
import { DEX_ADDRESS } from "../config";

const Exchange = () => {
  const { account } = useEthers();
  const [amount, setAmount] = useState("");
  const [isXtoY, setIsXtoY] = useState(true);

  const ammContract = new Contract(DEX_ADDRESS, AMMDexAbi);

  // Hook for X → Y
  const { state: stateXtoY, send: sendXtoY } =
    useContractFunction(ammContract, "swapXtoY", {
      transactionName: "Swap X to Y",
    });

  // Hook for Y → X
  const { state: stateYtoX, send: sendYtoX } =
    useContractFunction(ammContract, "swapYtoX", {
      transactionName: "Swap Y to X",
    });

  const handleSwap = () => {
    if (!amount || !account) return;

    const amountIn = utils.parseUnits(amount, 18);

    if (isXtoY) {
      sendXtoY(amountIn);
    } else {
      sendYtoX(amountIn);
    }
  };

  const currentState = isXtoY ? stateXtoY : stateYtoX;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        Swap {isXtoY ? "Token X → Token Y" : "Token Y → Token X"}
      </h3>

      <input
        type="number"
        placeholder={
          isXtoY ? "Amount of Token X" : "Amount of Token Y"
        }
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
      />

      <button
        onClick={() => setIsXtoY(!isXtoY)}
        style={styles.toggle}
      >
        ⇅ Switch
      </button>

      <button onClick={handleSwap} style={styles.button}>
        Swap
      </button>

      <div style={styles.status}>
        {currentState.status === "Mining" && (
          <p style={{ color: "#facc15" }}>Transaction Pending...</p>
        )}
        {currentState.status === "Success" && (
          <p style={{ color: "#22c55e" }}>Swap Successful</p>
        )}
        {currentState.status === "Exception" && (
          <p style={{ color: "#ef4444" }}>Transaction Failed</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "14px",
    background: "#111827",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "380px",
  },
  title: {
    color: "white",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "7px",
    borderRadius: "6px",
    border: "1px solid #374151",
    background: "#1f2937",
    color: "white",
    marginBottom: "6px",
    outline: "none",
    fontSize: "12px",
  },
  toggle: {
    width: "100%",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #374151",
    background: "#1f2937",
    color: "white",
    marginBottom: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
  button: {
    width: "100%",
    padding: "7px",
    borderRadius: "6px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "12px",
  },
  status: {
    marginTop: "6px",
    fontSize: "11px",
  },
};

export default Exchange;
