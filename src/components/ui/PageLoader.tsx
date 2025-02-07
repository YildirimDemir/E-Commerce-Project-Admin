import React from 'react'
import Style from './pageloader.module.css'
import Loader from './Loader'

export default function PageLoader() {
  return (
    <div className={Style.pageLoader}>
        <div className={Style.loader}></div> 
    </div>
  )
}