import React, { useEffect } from 'react';

const TradingViewWidget = () => {
  useEffect(() => {
    // Load the TradingView script dynamically
    const script = document.createElement('script');
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 550,
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: "dark",
      locale: "en",
      isTransparent: true
    });
    document.querySelector('.tradingview-widget-container__widget').appendChild(script);
    
    // Cleanup function to remove the script when component unmounts
    return () => {
      document.querySelector('.tradingview-widget-container__widget').innerHTML = '';
    };
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">   
      </div>
    </div>
  );
};

export default TradingViewWidget;
