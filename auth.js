const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const data = require('./Schema');

// const isAdmin =require("./verifyToken");


const { ReturnDocument } = require('mongodb');
// const { default: sendMail } = require('./sendMail');


const router = express.Router();


// Register
router.post('/register', async (req, res) => {
  const { name, email, password,role } = req.body;

  const existingUser = await data.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
// //generate otp
// const otp=Math.floor(Math.random()*1000000)

// //create signed activation token
// const activationToken=jwt.sign({existingUser,otp},process.env.JWT_SECRET,{expiresIn:"5m",});
//   //sendmail to user
// const message=`please verify your account using otp your otp is ${otp}`;
//   await sendMail(email,"welcome",message)
//   res.status(200).json({
//     message:"Otp sent your mail",
//     activationToken,
//   })

const user = new data({ name, email, password: hashedPassword,role });
  await user.save();
  console.log(user)
  res.status(201).json({ message: 'User registered successfully' });
  if(!user){
    return res.status(401).json({message:"user not found"})
  }
  if(user.role!=admin)
  {
    return res.status(403).json({message:"unauthorized:user is not an admin"})
  }
  req.user=user
  next()
});

// Login
router.post('/login', async (req, res) => {
  const { email, password,role } = req.body;

  const user = await data.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id ,role:user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({message:"welcome" + user.name ,token,user,role });
  
}); 

// middleware/auth.js

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Forbidden');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Unauthorized');
        req.user = decoded;
        next();
    });
};

module.exports = authMiddleware;


router.post('/logout',async(req,res)=>
{
  try{
    res.clearCookie('token')
      res.status(200).json({message:"user logout successfully"})
  }
  catch(error)
  {
    res.status(500).json({success:false,message:"internal server error"})
    console.log(error)
  }
})






module.exports = router;
