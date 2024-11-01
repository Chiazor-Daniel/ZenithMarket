/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';

export const MyChart = (props) => {
  const [pair, setPair] = useState(props.tradePair);
  const [themeMode, setThemeMode] = useState(true);
  const [container, setContainer] = useState(null);

  const theme = themeMode ? "dark" : "light";

  useEffect(() => {
    const scriptId = 'tradingview-chart-script';

    const existingScript = document.getElementById(scriptId);
    if (existingScript && existingScript.parentNode) {
      existingScript.parentNode.removeChild(existingScript);
    }

    if (container) {
      try {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;

        script.innerHTML = `
          {
            "autosize": true,
            "symbol": "BINANCE:${pair}",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "${theme}",
            "style": "1",
            "locale": "en",
            "backgroundColor": "",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
          }`;
        container.appendChild(script);
      } catch (error) {
        console.error("An error occurred while loading the TradingView script:", error);
      }
    }

    return () => {
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [pair, themeMode, container]);

  useEffect(() => {
    // Update the ref when the trade pair prop changes
    setPair(props.tradePair);
  }, [props.tradePair]);

  return (
    <div className="tradingview-widget-container" ref={setContainer} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
};
