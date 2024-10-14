const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./auth');
const users=require("./Itemd");
const parser=require("body-parser");
const data=require("./Schema")





const app = express();
const PORT = 4002;

connectDB();

app.use(cors());
app.use(express.json());
app.use(parser.json());

app.use('/api/auth', authRoutes);

app.get("/getUsers", async (req, res) => {
  try {
    const inside = await data.find();
    res.json(inside);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get("/getItem", async (req, res) => {
  try {
    const pro = await users.find();
    res.json(pro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/getItem", async (req, res) => {
  const newUser = new users(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/getItem/:id", async (req, res) => {
  try {
    const updatedUser = await users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/getItem/:id", async (req, res) => {
  try {
    await users.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(403);
  
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
};

// Cart Endpoint
let cart = [];
app.post('/cart', authenticateJWT, (req, res) => {
  const { productId } = req.body;
  cart.push({ userId: req.user.id, productId });
  res.status(201).send('Product added to cart');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
