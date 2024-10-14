const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  domain: { type: String, required: true },
  head: { type: String, required: true },
  price:{ type: Number, required: true },
 image:{type:String,required:true}
});

module.exports = mongoose.model('users', itemSchema);