const styles = {
  // App.js
  container: "flex justify-center items-center h-screen sm:px-16 px-6 bg-slate-900",
  innerContainer:
  "flex justify-center items-center flex-col max-w-[1280px] w-full",
  header: "flex flex-row justify-between items-center w-full py-3",
  exchangeContainer:
  "flex flex-col justify-center items-center w-full mt-2",
  headTitle: "text-white font-poppins font-black text-5xl tracking-wide",
  subTitle: "text-white/70 font-poppins font-medium mt-3 text-base",
  exchangeBoxWrapper: "mt-10 w-full flex justify-center",
  exchangeBox:
    "relative md:max-w-[700px] md:min-w-[500px] min-w-full max-w-full gradient-border p-[2px] rounded-3xl",
  exchange:
    "relative z-20 w-full bg-[#0f0e13] rounded-[24px] shadow-card flex flex-col p-6 overflow-hidden",

  // AmountIn & AmountOut
  amountContainer:
    "flex justify-between items-center flex-row w-full min-w-full bg-slate-800 border-[1px] border-transparent hover:border-slate-700 min-h-[96px] sm:p-8 p-4 rounded-[20px]",
  amountInput:
    "w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white",
  currencyButton:
    "flex flex-row items-center bg-slate-700 py-2 px-4 rounded-xl font-poppins font-bold text-white",
  currencyList:
    "absolute z-10 right-0 bg-slate-900 border-[1px] border-slate-700 w-full mt-2 rounded-lg min-w-[170px] overflow-hidden",
  currencyListItem:
    "font-poppins font-medium text-base text-white hover:text-slate-300 px-5 py-3 hover:bg-slate-700 cursor-pointer",

  // Exchange
  actionButton:
    "border-none outline-none px-6 py-2 font-poppins font-bold text-lg rounded-2xl leading-[24px] transition-all min-h-[56px]",
  message: "font-poppins font-lg text-white font-bold mt-7",

  // WalletButton
  walletButton:
  "bg-gradient-to-r from-[#00d2ff] to-[#3a7bd5] hover:from-[#00c6ff] hover:to-[#0072ff] border-none outline-none px-6 py-2 font-poppins font-bold text-lg text-white rounded-3xl leading-[24px] transition-all duration-300 shadow-[0_0_15px_rgba(0,210,255,0.3)] hover:shadow-[0_0_25px_rgba(0,210,255,0.5)]",


  // loader
  loader: "flex justify-center items-center flex-col w-full min-h-full",
  loaderImg: "w-56 h-56 object-contain",
  loaderText:
    "font-poppins font-normal text-white text-lg text-center mt-10",

  // balance
  balance: "w-full text-left mt-2 ml-2",
  balanceText: "font-poppins font-normal text-slate-300",
  balanceBold: "font-semibold text-white",
};

export default styles;
