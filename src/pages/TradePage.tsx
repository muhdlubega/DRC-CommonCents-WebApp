// import Navbar from '../components/navbar/Navbar'
import Chart from '../components/trade/Chart'
import Proposal from '../components/trade/Proposal'
import '../styles/main.scss'

const TradePage = () => {
  return (
    <div>
        {/* <Navbar/> */}
        <div className="product-container">
        <div style={{ flex: 2 }}>
        <Chart/>
        </div>
        <div style={{ flex: 1 }}>
        <Proposal/>
        </div>
        </div>
    </div>
  )
}

export default TradePage