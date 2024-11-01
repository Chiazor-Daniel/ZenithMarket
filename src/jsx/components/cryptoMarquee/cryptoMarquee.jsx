import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './CryptoMarquee.css';

const CryptoMarquee = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,dogecoin,solana,polkadot,tron,polygon,chainlink&vs_currencies=usd'
      );
      const data = await response.json();
      setPrices(data);
    };

    fetchPrices();
  }, []);

  const renderPrices = () => {
    return Object.keys(prices).map((key) => (
      <span key={key}>
        {key.charAt(0).toUpperCase() + key.slice(1)}: ${prices[key].usd} &nbsp;&nbsp;&nbsp;
      </span>
    ));
  };

  return (
    <Container fluid className="marquee-container bg-dark text-light">
      <Row>
        <Col>
          <div className="marquee-content">
            {renderPrices()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CryptoMarquee;
