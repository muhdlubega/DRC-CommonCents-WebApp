import Navbar from '../components/navbar/Navbar'
import Chart from '../components/trade/Chart'
import Proposal from '../components/trade/Proposal'
import Symbols from '../components/trade/Symbols'
import '../styles/main.scss'

const TradePage = () => {
  return (
    <div>
        <Navbar/>
        <div className="product-container">
        <div style={{ flex: 3 }}>
        <Chart/>
        </div>
        <div style={{ flex: 1 }}>
        <Symbols/>
        <Proposal/>
        </div>
        </div>
    </div>
  )
}

export default TradePage