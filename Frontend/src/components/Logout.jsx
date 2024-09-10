import React,{useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../../public/Logout.css';

function Logout() {

  const navigate= useNavigate();

  useEffect(()=>{
    //to handle logout
    const handleLogout = async() =>{
      try{
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        //make api call to logout
        await axios.post('/logout',{},{
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true  // This option includes cookies in the request
          });
        //({}): This is the request body. For a logout request, it is often empty because the server does not need any additional data to process the logout.
        //  withCredentials: true option tells axios to include cookies in the request. 
        // to clear token

        localStorage.removeItem('token');
        console.log('Logout successful');
        //redirect to login page
        navigate('/login');
    
      }catch(error){
        console.error('Logout Failed',error);
      }
    };

    handleLogout();
  },[navigate]); // Dependency array with navigate

  //[navigate] is included as a dependency.navigate ensures the effect only runs when navigate changes,
  //If you omit the dependency array, the effect runs after every render, which might be unnecessary and inefficient:



return (
    <div>Logging out...</div>
  )
}

export default Logout;