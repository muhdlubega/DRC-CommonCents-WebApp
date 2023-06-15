import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Product from '../components/trade/Product'
import Proposal from '../components/trade/Proposal'
import Contract from '../components/trade/Contract'
import '../App.css'
import Symbols from '../components/trade/Symbols'

const TradePage = () => {
  return (
    <div>
        <Navbar/>
        <div className="product-container">
        <div style={{ flex: 2 }}>
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