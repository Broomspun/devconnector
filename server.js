const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();


//Body parser middleware
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//DB config
const db = require('./config/keys').mongoURI;

// Connect to mongoDB
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(()=>console.log('MongoDB connected'))
    .catch((err)=>console.log(err));


app.get('/', (req, res)=>{
    res.send('Hello')
});

//use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts/', posts);


const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log(`Server running on port ${port}`));
