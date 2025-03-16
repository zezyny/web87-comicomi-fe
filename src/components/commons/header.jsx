import React from 'react'
import "./header.css"
import logo2 from '../../assets/logo2.png'
import logo1 from '../../assets/logo1.png'
function Header({pageTitle=null, children}) {
  return (
    <div className='header'>
      <img src={logo1} alt="" />
      {children}
      <h3>{pageTitle != null ? pageTitle : "No #1 Comic Distribution platform."}</h3>
    </div>
  )
}

export default Header