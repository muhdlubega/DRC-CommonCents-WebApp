import React, { useState, useEffect } from 'react';
import DerivAPIBasic from 'https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic';
import { useNavigate } from 'react-router-dom';
import '../../styles/main.scss';

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
  allow_forward_starting: number;
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

  const handleSelect = (symbol: string) => {
    navigate(`/trade/${symbol}`);
  };

  return (
    <div>
      <select
        className='symbols-dropdown'
        onChange={(e) => handleSelect(e.target.value)}
        value="1HZ10V"
      >
        {activeSymbols.map((symbol) => (
          symbol.market === 'synthetic_index' &&
          symbol.symbol_type === 'stockindex' &&
          symbol.allow_forward_starting === 1 && (
            <option key={symbol.symbol} value={symbol.symbol}>
              {symbol.display_name}
            </option>
          )
        ))}
      </select>
    </div>
  );
};

export default Symbols;
