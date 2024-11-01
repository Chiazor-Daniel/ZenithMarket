import React, { useEffect, useRef } from 'react';

const MarketStats = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "all_symbols",
      "isTransparent": true,
      "displayMode": "compact",
      "width": "100%",
      "height": "100%",
      "colorTheme": "dark",
      "locale": "en"
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', background: 'rgba(243, 243, 243, 0.04)', borderRadius: "20px" }} ref={containerRef}></div>
  );
};

export default MarketStats;
