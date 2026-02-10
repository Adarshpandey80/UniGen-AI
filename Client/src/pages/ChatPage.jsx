import React from 'react'
import axios from 'axios'
import { useEffect } from 'react'
 
export default function ChatPage() {

  const api = `${import.meta.env.VITE_API_URL}/user/request`
   const UserRequest =  async ()=>{
        const response = await axios.get(api)
        console.log(response.data);
   }
   useEffect(()=>{
     UserRequest()
   },[])

  return (
    <>
        <h1>Chat Page</h1>
         
    </>
  )
}
