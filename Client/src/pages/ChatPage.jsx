import React from 'react'
import axios from 'axios'
import { useEffect , useState} from 'react'
import { IoSend } from "react-icons/io5";
 
export default function ChatPage() {
  const [request , setRequest] = useState("");
  console.log(request)

 

  const api = `${import.meta.env.VITE_API_URL}/user/request`
   const UserRequest = async (e) => {
        e.preventDefault(); // Prevent form submission
        try {
            const response = await axios.post(api, { message: request });
            console.log('Response:', response.data);
            setRequest(""); // Clear input after successful send
        } catch (error) {
            console.error('Error sending message:', error);
        }
   }
   

  return (
    <>
        <h1>Chat Page</h1>
        <form onSubmit={UserRequest}>
          <input 
            type="text" 
            placeholder='enter your questions' 
            name='request' 
            value={request}
            onChange={(e)=>{setRequest(e.target.value)}} 
          />
          <button type="submit"><IoSend /></button>
        </form>
         
    </>
  )
}
