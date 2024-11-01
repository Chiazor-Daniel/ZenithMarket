import React, { useEffect } from 'react';

const ForexView = () => {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: 450,
      currencies: ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD"],
      colorTheme: "dark",
      locale: "en",
      isTransparent: true
    });
    
    // Append script to document
    document.querySelector('.tradingview-widget-container__widget').appendChild(script);
    
    // Cleanup on component unmount
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="tradingview-widget-container" style={{ backgroundColor: 'transparent' }}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default ForexView;
