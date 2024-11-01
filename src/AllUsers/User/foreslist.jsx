import React, { useState, useEffect } from 'react';

const ForexSymbolList = () => {
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://real-time-finance-data.p.rapidapi.com/stock-time-series-source-2',
          params: {
            symbol: 'AAPL',
            period: '1D',
          },
          headers: {
            'x-rapidapi-key': '7860e96119mshe5fcc7bb91bfb89p1cc964jsn415fb06ad16c',
            'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com',
          },
        };

        const response = await axios.request(options);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  if (loading) {
    return <div style={containerStyle}>Loading...</div>;
  }

  if (error) {
    return <div style={containerStyle}>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '20px' }}>Forex Symbol List</h1>
      <div style={gridStyle}>
        {symbols.map((symbol) => (
          <div key={symbol.symbol} style={cardStyle}>
            <h3>{symbol.symbol}</h3>
            <p>{symbol.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForexSymbolList;
