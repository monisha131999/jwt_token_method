const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config()


//mongoose connection
mongoose.connect('mongodb://127.0.0.1:27017/cookie')
.then(()=>{
  console.log("Db connection SUCCESS");
});


//module import
const User =require('./user')
const  MessageModel = require('./Message')
const verifyToken = require('./Middleware')


//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());


 


app.post('/signup', async (req, res) => {
  const { Fname, Lname, Email, Password } = req.body;
  const existingUser = await User.findOne({ Email });


  if (existingUser) {
    return res.json({ error: 'Email already exists' });
  }




  const newUser = new User({ Fname, Lname, Email, Password });


  await newUser.save();
  res.json(newUser);
});


app.post('/login', async (req, res) => {
  const { Email, Password } = req.body;
  const user = await User.findOne({ Email });


  if (!user) {
    return res.status(400).json({ message: 'Invalid email' });
  }


  if (Password !== user.Password) {
    return res.json({ message: 'Invalid password' });
  }


  const token = jwt.sign({ id: user._id, Email: user.Email }, process.env.secretKey, {
    expiresIn: '1h',
  });


  res.cookie('jwt', token, { httpOnly: true });


  res.json({ message: 'Login successful', token });
});




app.post('/postData', verifyToken, async (req, res) => {
  const { message } = req.body;


  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }


  const userId = req.user.id;


  const newMessage = new MessageModel({ userId, message });


  await newMessage.save();
  res.json({ message: 'Data posted successfully', data: newMessage });
});


app.get('/getData', verifyToken, async (req, res) => {
  const userId = req.user.id;


  const messages = await MessageModel.find({ userId });


  res.json({ message:'Data retrieved successfully', data: messages });
});


const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
