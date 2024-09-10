const express = require('express');
const mysql = require ('mysql');
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');
require('dotenv').config();
const cors = require ('cors');
const cookieParser = require('cookie-parser');


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(cookieParser());



//MySQL connection
const db_Connection= mysql.createConnection({
    host: 'localhost',         
    user: 'root',              
    password:  process.env.DB_PASSWORD,              
    database: 'social_Media'         
});

db_Connection.connect ((err)=>{
    if (err){
        console.error('Error connecting to the database',err.stack);
    }
    console.log('Connected to the database successfully')
});

// JWT Secret key from environment variable
const secretKey = process.env.JWT_SECRET_KEY;



//Middleware to authenticate JWT from cookies

const authenticateToken = (req,res,next)=>{
    const token = req.cookies.token; //get token from cookies

    if(token === null)
    {
        return res.sendStatus(401); //unauthorized
    }

    jwt.verify(token,secretKey,(err,user)=>{
        if(err)
        return res.sendStatus(403); //Forbidden

        req.user = user; //Attach user info into request
        next(); //proceed to next middleware or router
    });
    
};

//User Registration

app.post('/register',(req,res)=>{
    const {username,password}=req.body;
    const hashedPassword = bcrypt.hashSync(password,10);

    db_Connection.query('INSERT INTO users(username, password) VALUES (?,?)', [username,hashedPassword],(err,result)=>{
        if(err) 
        {
            console.error(err); // Log the error for debugging
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }
        

    res.status(201).json({message:'User registered successfully!!'});
    });

});


//User Login

app.post('/login',(req,res)=>{
    const {username, password} = req.body; //Extracting username and password from req.body
    // Query the database for the user with the provided username
    db_Connection.query('SELECT * from users WHERE username=?',[username],(err,results)=>{
        if(err)
        throw err;

    // If no user is found in the database (results.length is 0), it sends a response with a 400 Bad Request
    if(results.length ===0 )
    return res.status(400).json({message:'User not found'});
    //retrieves the first user record from the query result.
    const user = results[0]
    //compares the provided password with the hashed password stored in the database.
    if(!bcrypt.compareSync(password,user.password))
    return res.status(400).json({message: 'Invalid Password'});

    //Creates a JSON Web Token (JWT) containing the user’s id and username.
    const token = jwt.sign({id:user.id,username:user.username},secretKey,{ expiresIn: '1h' })
//Sends the generated token back to the client in JSON format. T
   res.json({ token });
 });

});


//Create a new post
//here authenticateToken ensures that the user making the request is authenticated by verifying their JWT.
//Authorization:It ensures that only valid users can access protected routes like creating posts.
app.post('/create-post',authenticateToken,(req,res)=>{

    const {content} = req.body;
    const userId = req.user.id; // represents the ID of the authenticated user.

    db_Connection.query('INSERT INTO posts (user_id,content) VALUES (?,?)',[userId,content],(err,result)=>{
        if (err)
        throw err;

        res.status(201).json({message:'Post created'});
    });

});


//get all posts

app.get('/posts',(req,res)=>{
    db_Connection.query('SELECT posts.*,users.username from posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC',(err,results)=>{
        if (err)
        throw err;
    res.json(results);
    });
});


//Like a post

app.post('/posts/:id/like',authenticateToken,(req,res)=>{
    const postsId= req.params.id;
    const userId= req.user.id
    db_Connection.query('INSERT INTO likes (user_id,post_id) VALUES (?,?)',[userId,postsId],(err,result)=>{
        if(err)
        throw err;
    res.status(201).json({message:'Liked'});
    });
});


// Fetch all users
app.get('/users', authenticateToken, (req, res) => {
    db_Connection.query('SELECT id, username FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(results);
    });
});

//Follow a user

app.post('/users/:id/follow',authenticateToken,(req,res)=>{
    const followId=req.params.id;
    const userId=req.user.id;

    db_Connection.query('INSERT INTO follow (follower_id,followed_id) VALUES (?,?)',[userId,followId],(err, result)=>{
        if (err) {
            console.error('Error following user:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'User followed' });
        
    });
});

//logout

app.post('/logout',authenticateToken,(req,res)=>{
    
      res.cookie('token', '', { expires: new Date(0), httpOnly: true });//'token'  name of the cookie you want to set or delete.
      res.status(200).json({ message: 'Logged out successfully' });
})








//start server
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    return;
}


)