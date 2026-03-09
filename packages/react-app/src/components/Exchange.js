import React, { useState, useEffect } from "react";
import {
  useEthers,
  useContractFunction,
  useCall,
} from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import AMMDexAbi from "@my-app/contracts/src/abis/AMMDex.json";
import ERC20Abi from "@my-app/contracts/src/abis/erc20.json";
import { DEX_ADDRESS } from "../config";

const Exchange = () => {
  const { account } = useEthers();

  const [amount, setAmount] = useState("");
  const [isXtoY, setIsXtoY] = useState(true);
  const [needsApproval, setNeedsApproval] = useState(false);

  /* -------------------- AMM CONTRACT -------------------- */

  const ammContract = DEX_ADDRESS
    ? new Contract(DEX_ADDRESS, AMMDexAbi)
    : undefined;

  /* -------------------- FETCH RESERVES -------------------- */

  const { value: reserveXValue } =
    useCall(
      ammContract && {
        contract: ammContract,
        method: "reserveX",
        args: [],
      }
    ) ?? {};

  const { value: reserveYValue } =
    useCall(
      ammContract && {
        contract: ammContract,
        method: "reserveY",
        args: [],
      }
    ) ?? {};

  const reserveX = reserveXValue?.[0];
  const reserveY = reserveYValue?.[0];

  /* -------------------- FETCH TOKEN ADDRESSES -------------------- */

  const { value: tokenXValue } =
    useCall(
      ammContract && {
        contract: ammContract,
        method: "tokenX",
        args: [],
      }
    ) ?? {};

  const { value: tokenYValue } =
    useCall(
      ammContract && {
        contract: ammContract,
        method: "tokenY",
        args: [],
      }
    ) ?? {};

  const tokenXAddress = tokenXValue?.[0];
  const tokenYAddress = tokenYValue?.[0];

  const selectedTokenAddress = isXtoY
    ? tokenXAddress
    : tokenYAddress;

  const tokenContract =
    selectedTokenAddress
      ? new Contract(selectedTokenAddress, ERC20Abi)
      : undefined;

  /* -------------------- CHECK ALLOWANCE -------------------- */

  const { value: allowanceValue } =
    useCall(
      account &&
      tokenContract && {
        contract: tokenContract,
        method: "allowance",
        args: [account, DEX_ADDRESS],
      }
    ) ?? {};

  const allowance = allowanceValue?.[0];

  useEffect(() => {
    if (!amount || !allowance) {
      setNeedsApproval(false);
      return;
    }

    const amountIn = utils.parseUnits(amount || "0", 18);
    setNeedsApproval(allowance.lt(amountIn));
  }, [amount, allowance]);

  /* -------------------- APPROVE FUNCTION -------------------- */

  const {
    send: sendApprove,
    state: approveState,
  } = useContractFunction(
    tokenContract ?? undefined,
    "approve",
    { transactionName: "Approve Token" }
  );

  const handleApprove = () => {
    if (!amount) return;
    const amountIn = utils.parseUnits(amount, 18);
    sendApprove(DEX_ADDRESS, amountIn);
  };

  /* -------------------- SWAP FUNCTIONS -------------------- */

  const {
    state: stateXtoY,
    send: sendXtoY,
  } = useContractFunction(
    ammContract ?? undefined,
    "swapXtoY",
    { transactionName: "Swap X to Y" }
  );

  const {
    state: stateYtoX,
    send: sendYtoX,
  } = useContractFunction(
    ammContract ?? undefined,
    "swapYtoX",
    { transactionName: "Swap Y to X" }
  );

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

  /* -------------------- PRICE + ESTIMATION -------------------- */

  let price = 0;
  let estimatedOutput = 0;

  if (reserveX && reserveY && amount) {
    const rX = parseFloat(utils.formatUnits(reserveX, 18));
    const rY = parseFloat(utils.formatUnits(reserveY, 18));
    const amountIn = parseFloat(amount);

    if (amountIn > 0) {
      if (isXtoY) {
        price = rY / rX;

        const amountInWithFee = amountIn * 997;
        const numerator = amountInWithFee * rY;
        const denominator = (rX * 1000) + amountInWithFee;

        estimatedOutput = numerator / denominator;

      } else {
        price = rX / rY;

        const amountInWithFee = amountIn * 997;
        const numerator = amountInWithFee * rX;
        const denominator = (rY * 1000) + amountInWithFee;

        estimatedOutput = numerator / denominator;
      }
    }
  }

  /* -------------------- LOADING SAFETY -------------------- */

  if (!ammContract || !reserveX || !reserveY) {
    return (
      <div style={styles.container}>
        <p style={{ color: "white" }}>
          Loading contract data...
        </p>
      </div>
    );
  }

  /* -------------------- UI -------------------- */

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        Swap {isXtoY ? "Token X → Token Y" : "Token Y → Token X"}
      </h3>

      <input
        type="number"
        placeholder={
          isXtoY
            ? "Amount of Token X"
            : "Amount of Token Y"
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

      <div style={styles.info}>
        <p>Price: {price.toFixed(6)}</p>
        <p>
          Reserves:{" "}
          {utils.formatUnits(reserveX, 18)} X /{" "}
          {utils.formatUnits(reserveY, 18)} Y
        </p>
        <p>
          Estimated Output:{" "}
          {estimatedOutput.toFixed(6)}
        </p>
      </div>

      {needsApproval ? (
        <button
          onClick={handleApprove}
          style={styles.button}
        >
          {approveState.status === "Mining"
            ? "Approving..."
            : "Approve"}
        </button>
      ) : (
        <button
          onClick={handleSwap}
          style={styles.button}
        >
          {currentState.status === "Mining"
            ? "Swapping..."
            : "Swap"}
        </button>
      )}

      <div style={styles.status}>
        {currentState.status === "Success" && (
          <p style={{ color: "#22c55e" }}>
            Swap Successful
          </p>
        )}
        {currentState.status === "Exception" && (
          <p style={{ color: "#ef4444" }}>
            Transaction Failed
          </p>
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
  info: {
    fontSize: "11px",
    color: "#d1d5db",
    marginBottom: "8px",
  },
  status: {
    marginTop: "6px",
    fontSize: "11px",
  },
};

export default Exchange;