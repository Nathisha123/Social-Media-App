import React from 'react';
import { Link } from 'react-router-dom';
import '../../public/Home.css';
import Feed from '././Feed';

function Home() {
  return (
    <div className='home'>
      <h1>Welcome to HomePage!</h1>
      <nav>
        <Link to='/login' className='nav-link'>Login</Link>
        <Link to='/register' className='nav-link'>Register</Link>
       </nav>
      <Feed />
    </div>
  );
}

export default Home;
