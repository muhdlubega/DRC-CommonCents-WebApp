import React, { useState, useEffect } from 'react';
import DerivAPIBasic from 'https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic';
import { useNavigate } from 'react-router-dom';

const app_id = 1089;
const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
const api = new DerivAPIBasic({ connection });

const active_symbols_request = {
  active_symbols: 'brief',
  product_type: 'basic',
};

interface Symbol {
  symbol: string;
  display_name: string;
  market: string;
  symbol_type: string;
  // Add any other properties you expect to receive
}

const Symbols: React.FC = () => {
  const [activeSymbols, setActiveSymbols] = useState<Symbol[]>([]);
  const navigate = useNavigate();

  const handleActiveSymbolsResponse = async (res: MessageEvent) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log('Error: ', data.error?.message);
      connection.removeEventListener('message', handleActiveSymbolsResponse, false);
      await api.disconnect();
    }

    if (data.msg_type === 'active_symbols') {
      setActiveSymbols(data.active_symbols);
      console.log(data.active_symbols);
      connection.removeEventListener('message', handleActiveSymbolsResponse, false);
    }
  };

  const getActiveSymbols = async () => {
    connection.addEventListener('message', handleActiveSymbolsResponse);
    await api.activeSymbols(active_symbols_request);
  };

  useEffect(() => {
    getActiveSymbols();
  }, []);

  const handleClick = (symbol: string) => {
    navigate(`/trade/${symbol}`);
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', justifyItems: 'center' }}>
        {activeSymbols.map((symbol) => (
          symbol.market === 'synthetic_index' && symbol.symbol_type === 'stockindex' && (
            <div
              key={symbol.symbol}
              onClick={() => handleClick(symbol.symbol)}
              style={{
                border: '1px solid darkorchid',
                borderRadius: 5,
                margin: 10,
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                fontFamily: 'Montserrat',
                cursor: 'pointer',
                backgroundColor: 'darkorchid',
                color: 'white',
                fontWeight: 'bold',
                width: '80%',
              }}
            >
              {symbol.display_name}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Symbols;
