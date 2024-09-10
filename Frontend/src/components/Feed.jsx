import React,{useState,useEffect} from 'react';
import axios from 'axios';
import '../../public/Feed.css'


 {/* displays posts and allows users to like posts. */}

function Feed() {
      const [posts,setPosts]= useState([]);
      const [error,setError]=useState('');
      const [users, setUsers] = useState([]);

      useEffect(()=>{
        const fetchData = async() =>{
          try{

             // Fetch posts
            const postsResponse = await axios.get('/posts');
            //console.log('Posts Response:', postsResponse.data); // Log the response
            setPosts(postsResponse.data); //response.data refers to the data payload that the server returns
            // Fetch users
            const usersResponse = await axios.get('/users');
            setUsers(usersResponse.data);
         
          }catch(err){
            setError('Failed to load posts.');  //to display error in UI
            //console.log('Users Response:', usersResponse.data); // Log the response
            console.error('Failed to fetch posts or users:', err); //to display error in console
          }
        };
        fetchData();
        console.log("Error is ",fetchData);
      },[]);



  const likePost = async(postId)=>{
    try{
       const likeToken= localStorage.getItem('token');
       await axios.post(`/posts/${postId}/like`,{},{
        headers:{
          'Authorization':`Bearer ${likeToken}`
        },
        
       });
       console.log('Post liked successfully');
    }catch (err) {
      console.error('Failed to like post', err);
    }

  };


  const followUser= async(userId)=>{
    try{
      const followToken = localStorage.getItem('token');
      await axios.post(`/users/${userId}/follow`,{},{
        headers: {
          'Authorization': `Bearer ${followToken}`,
        },
      });
      console.log('User followed successfully');
    } catch (err) {
      console.error('Failed to follow user', err);
    }
    };
  

    



  return (
    <div className="feed">
     <h1>Feeds</h1>
     {error && <p className="error">{error}</p>}
     {/* Error Handling: Displays an error message if the fetch fails.
Posts Display: Renders a list of posts or a message indicating no posts are available. */}

      {/* Posts Section */}
      <div className="posts">
        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <p>{post.content}</p>
                <button onClick={() => likePost(post.id)}>Like</button>
              </li>
            ))}
          </ul>
        )}
      </div>



        {/* Users Section */}
        <div className="users">
        <h2>Users</h2>
        {users.length === 0 ? (
          <p>No users available</p>
        ) : (
          <ul>
            {users.map(user => (
              <li key={user.id}>
                <p>{user.username}</p>
                <button onClick={() => followUser(user.id)}>Follow</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
  
export default Feed;