import React, { useState, useEffect } from "react"
import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core"
import styles from "../styles"

const WalletButton = () => {
  const { account, activateBrowserWallet, deactivate } = useEthers()
  const { ens } = useLookupAddress(account)
  const [accountAddress, setAccountAddress] = useState("")

  useEffect(() => {
    if (account) {
      if (ens) {
        setAccountAddress(ens)
      } else {
        setAccountAddress(shortenAddress(account))
      }
    } else {
      setAccountAddress("")
    }
  }, [account, ens])

  return (
    <button
      onClick={() => {
        if (!account) activateBrowserWallet()
        else deactivate()
      }}
      className={styles.walletButton}
    >
      {accountAddress || "Connect Wallet"}
    </button>
  )
}

export default WalletButton
