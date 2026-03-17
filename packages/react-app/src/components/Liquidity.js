import React, { useState, useEffect } from "react";
import { useEthers, useContractFunction, useCall } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";

import AMMDexAbi from "@my-app/contracts/src/abis/AMMDex.json";
import { DEX_ADDRESS } from "../config";

const Liquidity = () => {
  const { account } = useEthers();

  const [amountX, setAmountX] = useState("");
  const [amountY, setAmountY] = useState("");
  const [removeAmount, setRemoveAmount] = useState("");

  /* -------------------- CONTRACT -------------------- */

  const ammContract = DEX_ADDRESS
    ? new Contract(DEX_ADDRESS, AMMDexAbi)
    : undefined;

  /* -------------------- RESERVES -------------------- */

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

  /* -------------------- USER LIQUIDITY -------------------- */

  const { value: liquidityValue } =
    useCall(
      account &&
      ammContract && {
        contract: ammContract,
        method: "liquidityBalance",
        args: [account],
      }
    ) ?? {};

  const userLiquidity = liquidityValue?.[0];

  /* -------------------- ADD LIQUIDITY -------------------- */

  const {
    state: addState,
    send: sendAddLiquidity,
  } = useContractFunction(
    ammContract ?? undefined,
    "addLiquidity",
    { transactionName: "Add Liquidity" }
  );

  const handleAddLiquidity = () => {
    if (!amountX || !amountY) return;

    const x = utils.parseUnits(amountX, 18);
    const y = utils.parseUnits(amountY, 18);

    sendAddLiquidity(x, y);
  };

  /* -------------------- REMOVE LIQUIDITY -------------------- */

  const {
    state: removeState,
    send: sendRemoveLiquidity,
  } = useContractFunction(
    ammContract ?? undefined,
    "removeLiquidity",
    { transactionName: "Remove Liquidity" }
  );

  const handleRemoveLiquidity = () => {
    if (!removeAmount) return;

    const amount = utils.parseUnits(removeAmount, 18);

    sendRemoveLiquidity(amount);
  };

  /* -------------------- CLEAR INPUT LOGIC -------------------- */

  useEffect(() => {
    if (addState.status === "Success") {
      setAmountX("");
      setAmountY("");
    }
  }, [addState.status]);

  useEffect(() => {
    if (removeState.status === "Success") {
      setRemoveAmount("");
    }
  }, [removeState.status]);

  /* -------------------- LOADING -------------------- */

  if (!ammContract || !reserveX || !reserveY) {
    return (
      <div style={styles.container}>
        <p style={{ color: "white" }}>Loading liquidity data...</p>
      </div>
    );
  }

  /* -------------------- UI -------------------- */

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Liquidity Pool</h3>

      <div style={styles.info}>
        <p>
          Pool Reserves:{" "}
          {utils.formatUnits(reserveX, 18)} X /{" "}
          {utils.formatUnits(reserveY, 18)} Y
        </p>

        <p>
          Your Liquidity:{" "}
          {userLiquidity
            ? utils.formatUnits(userLiquidity, 18)
            : "0"}
        </p>
      </div>

      {/* ADD LIQUIDITY */}

      <h4 style={styles.subtitle}>Add Liquidity</h4>

      <input
        type="number"
        placeholder="Token X Amount"
        value={amountX}
        onChange={(e) => setAmountX(e.target.value)}
        style={styles.input}
      />

      <input
        type="number"
        placeholder="Token Y Amount"
        value={amountY}
        onChange={(e) => setAmountY(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleAddLiquidity} style={styles.button}>
        {addState.status === "Mining"
          ? "Adding..."
          : "Add Liquidity"}
      </button>

      {/* REMOVE LIQUIDITY */}

      <h4 style={styles.subtitle}>Remove Liquidity</h4>

      <input
        type="number"
        placeholder="Liquidity Amount"
        value={removeAmount}
        onChange={(e) => setRemoveAmount(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleRemoveLiquidity} style={styles.button}>
        {removeState.status === "Mining"
          ? "Removing..."
          : "Remove Liquidity"}
      </button>

      <div style={styles.status}>
        {addState.status === "Success" && (
          <p style={{ color: "#22c55e" }}>
            Liquidity Added Successfully
          </p>
        )}

        {removeState.status === "Success" && (
          <p style={{ color: "#22c55e" }}>
            Liquidity Removed Successfully
          </p>
        )}
      </div>
    </div>
  );
};

/* -------------------- STYLES -------------------- */

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
  subtitle: {
    color: "white",
    marginTop: "10px",
    marginBottom: "6px",
    fontSize: "13px",
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
    marginBottom: "6px",
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

export default Liquidity;