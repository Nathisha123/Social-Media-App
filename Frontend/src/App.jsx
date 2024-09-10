import React from 'react';
import { BrowserRouter as Router,Routes,Route,Link,Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import Logout from './components/Logout';
import Home from './components/Home';


function App() {
  return (
    
  <Router>
    <nav className='navbar'>
    <Link to="/home">Home</Link>
    <Link to="/login">Login</Link>
    <Link to="/register">Register</Link>
    <Link to="/create-post">Create Post </Link>
    <Link to="/logout">Logout</Link>
   </nav>

   <Routes>
   <Route path="/home" element={<Home/>} />
   <Route path='/register' element={<Register/>}/>
   <Route path='/login' element={<Login/>}/>
   <Route path='/create-post' element={<CreatePost/>}/>
   <Route path='/logout' element={<Logout/>}/>
   <Route path="/" element={<Navigate to="/home" replace />} />

   </Routes>

</Router>





  );
}

export default App;