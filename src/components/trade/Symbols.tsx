import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/main.scss';
import { observer } from 'mobx-react';
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
      <select
        className='symbols-dropdown'
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="">Select symbol</option>
        {apiStore.activeSymbols.map((symbol) => (
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
});

export default Symbols;
