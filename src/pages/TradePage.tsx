import Chart from '../components/trade/Chart'
import Price from '../components/trade/Price'
import Proposal from '../components/trade/Proposal'

const TradePage = () => {
  //trade page router
  return (
    <div>
        <div className="product-container">
        <div style={{ flex: 4 }}>
        <Chart/>
        </div>
        <div style={{ flex: 1 }}>
          <Price/>
        <Proposal/>
        </div>
        </div>
    </div>
  )
}

export default TradePage