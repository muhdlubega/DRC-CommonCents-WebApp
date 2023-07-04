// import Navbar from '../components/navbar/Navbar'
import Chart from '../components/trade/Chart'
import Price from '../components/trade/Price'
import Proposal from '../components/trade/Proposal'
import '../styles/main.scss'

const TradePage = () => {
  return (
    <div>
        {/* <Navbar/> */}
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