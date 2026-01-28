import React from "react"
import { useEthers } from "@usedapp/core"

import { usePools } from "./hooks"
import styles from "./styles"
import { uniswapLogo } from "./assets"
import { Exchange, Loader, WalletButton } from "./components"

const App = () => {
  const { account } = useEthers();
  // const [loading,pools] = usePools();


  return (
    <div className={styles.container} >
      <div className={styles.innerContainer} >
        <header className={styles.header} >
          <img src={uniswapLogo} alt="Uniswap Logo" className="w-16 h-16 object-contain" />
          <WalletButton />
        </header>

        <div className={styles.exchangeContainer} >
          <h1 className={styles.headTitle}>ChainSwap</h1>
          <p className={styles.subTitle}>Exchange Tokens in seconds</p>
          <div className={styles.exchangeBoxWrapper} >
            <div className={styles.exchangeBox}>
              <div className="pink_gradient" />
              <div className={styles.exchange} >
                {account ? (
                  <p style={{ color: "white" }}>Exchange</p>
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
  )
}

export default App; 