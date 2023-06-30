import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Select, MenuItem } from '@mui/material';
import apiStore from '../../store/ApiStore';

const Symbols = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    apiStore.getActiveSymbols();
  }, []);

  const handleSelect = (symbol: string) => {
    navigate(`/trade/${symbol}`);
  };

  return (
    <div>
      <Select
        className='symbols-dropdown'
        value={apiStore.selectedSymbol}
        onChange={(e) => handleSelect(e.target.value)}
      >
        {apiStore.activeSymbols.map((symbol) => (
          symbol.market === 'synthetic_index' &&
          symbol.symbol_type === 'stockindex' &&
          symbol.allow_forward_starting === 1 && (
            <MenuItem key={symbol.symbol} value={symbol.symbol}>
              {symbol.display_name}
            </MenuItem>
          )
        ))}
      </Select>
    </div>
  );
});

export default Symbols;
