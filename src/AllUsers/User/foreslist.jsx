import React, { useEffect } from 'react';

const ForexSymbolList = () => {
  useEffect(() => {
    // Check if the TradingView script is already present
    const existingScript = document.getElementById('tradingview-timeline-script');
    if (!existingScript) {
      // Dynamically load the TradingView widget script
      const script = document.createElement('script');
      script.id = 'tradingview-timeline-script'; // Set an ID for the script
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "feedMode": "all_symbols",
        "isTransparent": true,
        "displayMode": "regular",
        "width": "100%",
        "height": "100%",
        "colorTheme": "dark",
        "locale": "en"
      });
      
      // Append the script to the widget container
      const widgetContainer = document.getElementById('tradingview-widget');
      if (widgetContainer) {
        widgetContainer.appendChild(script);
      }
    }
  }, []);

  return (
    <div >
      <div className="tradingview-widget-container" id="tradingview-widget" style={{ height: '100%' }}>
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
        </div>
      </div>
    
    </div>
  );
};

export default ForexSymbolList;