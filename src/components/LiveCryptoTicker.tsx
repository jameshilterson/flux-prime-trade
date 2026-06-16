import { useEffect, useRef } from "react";

/**
 * Official TradingView Ticker Tape widget.
 * Mounted directly under the hero with no gap (parent controls spacing).
 */
export const LiveCryptoTicker = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
        { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
        { proName: "BITSTAMP:ETHUSD", title: "ETH/USD" },
        { proName: "BINANCE:SOLUSDT", title: "SOL/USDT" },
        { proName: "BINANCE:BNBUSDT", title: "BNB/USDT" },
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "FX:GBPUSD", title: "GBP/USD" },
        { proName: "OANDA:XAUUSD", title: "Gold" },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });
    container.current.appendChild(script);
  }, []);

  return (
    <div className="border-y border-border bg-card/20">
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
};
