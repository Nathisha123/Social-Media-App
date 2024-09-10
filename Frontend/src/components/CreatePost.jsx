import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../public/CreatePost.css';

function CreatePost() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();


const handleSubmit = async(e) =>{
  e.preventDefault();
  setError('');
  setSuccess('');

 try {
  
  const response = await fetch('/create-post',{
    method:'POST',
    headers:{
      'Content-type':'application/json',
      'Authorization':`Bearer ${accessToken}`
    },
    body:JSON.stringify({content})
  });

  if(response.ok){
    const data = await response.json();
    setSuccess('Post created successfully!');
    setContent('');
    setTimeout(()=>navigate('/'),2000);

  }else{
    const errorData = await response.json();
    setError(errorData.message || 'Failed to create post.');

  }
  
 }catch(error)
 {
  console.error('Error creating post:', error);
  setError('An error occurred. Please try again.');
 }

};





  return (
    <div className='create-post'>
   <h1>Create Post</h1>
   <form onSubmit={handleSubmit}>
    <textarea 
     placeholder ="Write your post here!..."
     value ={content}
     onChange={(e)=>setContent(e.target.value)}
    
    />
    <button type="submit">Post</button>
    </form>
    {/* Conditional Rendering Syntax:

     The syntax {condition && <Component />} is a common pattern in React for conditional rendering. Here's how it works:
    condition: This is a JavaScript expression that evaluates to either true or false. If it evaluates to true, the <Component /> (or whatever JSX you provide) will be rendered.
     <Component />: This is the JSX element that will be rendered if the condition is true. */}


    {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  )
}

export default CreatePost