import React, { useEffect, useRef, memo } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { useContext, useState } from 'react';

function TradingViewWidget() {
  const container = useRef();
  const { background } = useContext(ThemeContext);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    if (background && !widgetLoaded) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "container_id": "analytics-platform-chart-demo",
          "width": "100%",
          "height": "100%",
          "autosize": true,
          "symbol": "NASDAQ:AAPL",
          "interval": "D",
          "timezone": "exchange",
          "theme": "${background.value}",
          "style": "3",
          "withdateranges": true,
          "allow_symbol_change": true,
          "save_image": false,
          "details": true,
          backgroundColor": "rgba(9, 4, 67, 1)",
          "hotlist": true,
          "calendar": false
        }`;
      container.current.appendChild(script);
      setWidgetLoaded(true);
    }
  }, [background, widgetLoaded]);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%", marginTop: "-20px" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%", borderRadius: "20px" }}></div>
      {/* <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div> */}
    </div>
  );
}

export default memo(TradingViewWidget);


