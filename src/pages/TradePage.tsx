import Navbar from '../components/navbar/Navbar'
import Product from '../components/trade/Product'
import Proposal from '../components/trade/Proposal'
import Symbols from '../components/trade/Symbols'
import '../styles/main.scss'

const TradePage = () => {
  return (
    <div>
        <Navbar/>
        <div className="product-container">
        <div style={{ flex: 3 }}>
        <Product/>
        </div>
        <div style={{ flex: 1 }}>
        <Symbols/>
        <Proposal/>
        {/* <Contract/> */}
        </div>
        </div>
    </div>
  )
}

export default TradePage