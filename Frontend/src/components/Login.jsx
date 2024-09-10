import React, { useState } from 'react';
import '../../public/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleSubmit = async(e) => {
    e.preventDefault();

     // Clear previous error/success messages
     setError('');
     setSuccess('');

     try{
        const response = await fetch('/login',{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({username,password})

        });

        if (response.ok){
          const data = await response.json();
          // Store token in localStorage
        localStorage.setItem('token', data.token);
          // Handle success
          setSuccess('Login Successfull');
        }
        else{
          const errorData = await response.json();
            // Handle error and show error
            setError(errorData.message || 'Login Failed');
        }
    }
    catch(error)
    {
      // Handle network errors or other issues
      setError('An error occurred. Please try again later.');

    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
