import React,{useState} from 'react';
import '../../public/Register.css';


function Register() {

const [username,setUsername]=useState('');
const [password,setPassword]=useState('');
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

//form submission handling
const handleSubmit =async (e)=>{
    e.preventDefault();

//basic validation
if(!username || !password) 
{
    setError('Username and Password are required');
    return;
}

try{
    //request to the server
    const response = await fetch('/register',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({username,password}),//for converting the data sending to server into string
        
    });
if (response.ok){
    const data = await response.json(); //parses the json response from the server.
    // Store token in localStorage
    localStorage.setItem('token', data.token);
    setSuccess('Registration Successful!');
    setError('');
}else{
    const errorData= await response.json();
    setError(errorData.message || 'Registration failed. Please try again. ');
}
}
catch(error){
    setError('An error occurred. Please try again.');
    setSuccess('');
}
};






  return (
    <div className='register'>
    <h1>Register</h1>
   <form onSubmit={handleSubmit} >
        <input type="text" 
        placeholder="Username"
        value={username} // Bind value to username state
        onChange={(e)=>setUsername(e.target.value)}
        />
        <input type="password" 
        placeholder="Password"
        value={password} // Bind value to password state
        onChange = {(e)=> setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
        
    </form>

    </div>
  )
}

export default Register;