import React from 'react'
import { Outlet } from 'react-router-dom'


import Histroy from './components/Histroy'

function Layout() {
  return (
    <>
      <h1> My Chat Boat AI </h1>
       
        <div>
            <div>
                   <Histroy />
            </div>
            <div>
                 <Outlet />
            </div>
        </div>
       
        
        
    </>
  )
}

export default Layout