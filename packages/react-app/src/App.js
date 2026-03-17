import React, { useState } from "react";
import { useEthers } from "@usedapp/core";

import styles from "./styles";
import { logo } from "./assets";
import { Exchange, Liquidity, Loader, WalletButton } from "./components";

const App = () => {
  const { account } = useEthers();

  // ✅ NEW: Tab State
  const [activeTab, setActiveTab] = useState("swap");

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>

        {/* Header */}
        <header className={styles.header}>
          <img
            src={logo}
            alt="Uniswap Logo"
            className="w-30 h-30 object-contain"
          />
          <WalletButton />
        </header>

        {/* Main Section */}
        <div className={styles.exchangeContainer}>
          <h1 className={styles.headTitle}>ChainSwap</h1>
          <p className={styles.subTitle}>Exchange Tokens in seconds</p>

          <div className={styles.exchangeBoxWrapper}>
            <div className={styles.exchangeBox}>

              <div className="pink_gradient" />

              <div className={styles.exchange}>
                {account ? (
                  <>
                    {/* ✅ NEW: Tabs */}
                    <div
                      style={{
                        display: "flex",
                        background: "#1f2937",
                        borderRadius: "12px",
                        padding: "4px",
                        marginBottom: "15px",
                        width: "100%",
                      }}
                    >
                      <button
                        onClick={() => setActiveTab("swap")}
                        style={{
                          flex: 1,
                          padding: "6px",
                          borderRadius: "8px",
                          background:
                            activeTab === "swap" ? "#3b82f6" : "transparent",
                          color: "white",
                          border: "none",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Swap
                      </button>

                      <button
                        onClick={() => setActiveTab("liquidity")}
                        style={{
                          flex: 1,
                          padding: "6px",
                          borderRadius: "8px",
                          background:
                            activeTab === "liquidity" ? "#3b82f6" : "transparent",
                          color: "white",
                          border: "none",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        Liquidity
                      </button>
                    </div>

                    {/* ✅ CONDITIONAL RENDER */}
                    {activeTab === "swap" ? (
                      <Exchange />
                    ) : (
                      <Liquidity />
                    )}
                  </>
                ) : (
                  <Loader title="Please connect your wallet" />
                )}
              </div>

              <div className="blue_gradient" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;