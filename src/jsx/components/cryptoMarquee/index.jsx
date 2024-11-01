import React, { useEffect } from 'react';

const CryptoCurrencyWidget = () => {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = "https://public.bnbstatic.com/unpkg/growth-widget/cryptoCurrencyWidget@0.0.13.min.js";
    script.async = true;

    // Append the script to the document head
    document.head.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      className="binance-widget-marquee"
      data-cmc-ids="1,1027,1839,5426,3408,52,74,5805,3890,7083"
      data-theme="dark"
      data-transparent="true"
      data-powered-by="Fintexch"
      data-disclaimer="fintexch.app"
    ></div>
  );
};

export default CryptoCurrencyWidget;
