const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/* -------------------- MongoDB Connection -------------------- */

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected"))
.catch(err=> console.log(err));


/* -------------------- USER SCHEMA -------------------- */

const userSchema = new mongoose.Schema({

username:{
type:String,
required:true,
unique:true
},

email:{
type:String,
required:true,
unique:true
},

password:{
type:String,
required:true
}

});

const User = mongoose.model("User",userSchema);


/* -------------------- PRODUCT SCHEMA -------------------- */

const productSchema = new mongoose.Schema({

productName:{
type:String,
required:true
},

productCode:{
type:String,
required:true,
unique:true
},

category:{
type:String
},

supplierName:{
type:String,
required:true
},

quantityInStock:{
type:Number,
min:0
},

reorderLevel:{
type:Number,
min:1
},

unitPrice:{
type:Number,
min:1
},

manufactureDate:{
type:Date
},

productType:{
type:String,
enum:["Perishable","Non-Perishable"]
},

status:{
type:String,
default:"Available",
enum:["Available","Out of Stock"]
}

},{timestamps:true})

const Product = mongoose.model("Product",productSchema);


/* -------------------- USER APIs -------------------- */


// Register User
app.post('/register', async(req,res)=>{

try{

const {username,email,password} = req.body;

const newUser = new User({
username,
email,
password
});

await newUser.save();

res.status(201).json({
message:"User registered successfully",
user:newUser
});

}

catch(err){

res.status(400).json({
error:err.message
});

}

});


// Get all users
app.get('/users', async(req,res)=>{

try{

const users = await User.find();

res.json(users);

}

catch(err){

res.status(500).json({
error:"Internal server error"
});

}

});


// Update user
app.put('/users/:username', async(req,res)=>{

try{

const {username} = req.params;
const {email,password} = req.body;

const result = await User.updateOne(
{username},
{email,password}
);

if(result.modifiedCount === 0){

return res.status(404).json({
error:"User not found or no change"
});

}

res.json({
message:"User updated successfully"
});

}

catch(err){

res.status(500).json({
error:"Internal server error"
});

}

});


// Delete user
app.delete('/users/:username', async(req,res)=>{

try{

const {username} = req.params;

const result = await User.deleteOne({username});

if(result.deletedCount === 0){

return res.status(404).json({
error:"User not found"
});

}

res.json({
message:"User deleted successfully"
});

}

catch(err){

res.status(500).json({
error:"Internal server error"
});

}

});


/* -------------------- PRODUCT APIs -------------------- */


// Add product
app.post('/products', async(req,res)=>{

try{

const product = new Product(req.body);

await product.save();

res.status(201).json({
message:"Product added successfully",
product
});

}

catch(err){

res.status(400).json({
error:err.message
});

}

});


// Get all products
app.get('/products', async(req,res)=>{

try{

const products = await Product.find();

res.json(products);

}

catch(err){

res.status(500).json({
error:"Internal server error"
});

}

});


// Get product by id
app.get('/products/:id', async(req,res)=>{

try{

const product = await Product.findById(req.params.id);

res.json(product);

}

catch(err){

res.status(500).json({
error:"Product not found"
});

}

});


// Update product
app.put('/products/:id', async(req,res)=>{

try{

const product = await Product.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
);

res.json(product);

}

catch(err){

res.status(500).json({
error:"Update failed"
});

}

});


// Delete product
app.delete('/products/:id', async(req,res)=>{

try{

await Product.findByIdAndDelete(req.params.id);

res.json({
message:"Product deleted successfully"
});

}

catch(err){

res.status(500).json({
error:"Delete failed"
});

}

});


// Search product by name
app.get('/products/search', async(req,res)=>{

try{

const name = req.query.name;

const products = await Product.find({
productName:{$regex:name,$options:"i"}
});

res.json(products);

}

catch(err){

res.status(500).json({
error:"Search failed"
});

}

});


// Filter by category
app.get('/products/category', async(req,res)=>{

try{

const cat = req.query.cat;

const products = await Product.find({
category:cat
});

res.json(products);

}

catch(err){

res.status(500).json({
error:"Filter failed"
});

}

});


/* -------------------- SERVER -------------------- */

app.listen(PORT,()=>{

console.log(`Server running on port ${PORT}`);

});