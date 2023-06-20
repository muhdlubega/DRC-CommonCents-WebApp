// import React from 'react'

import LatestNews from "../components/homepage/LatestNews"
import Navbar from "../components/navbar/Navbar"
import '../styles/main.scss'

const NewsPage = () => {
  return (
    <div>
        <Navbar/>
        <div className="newspage-header">
        <div className="newspage-card">
        <div className="newspage-text">
          <p className="newspage-title">CommonCents NewsHub</p>
        </div>
      </div></div>
        <LatestNews/>
    </div>
  )
}

export default NewsPage