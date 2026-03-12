const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


// REGISTER USER
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email,
            password
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });

    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});


// GET ALL USERS
app.get('/users', async (req, res) => {
    try {

        const users = await User.find();

        res.json(users);

    } catch (err) {

        res.status(500).json({
            error: "Internal server error"
        });

    }
});


// DELETE USER
app.delete('/users/:username', async (req, res) => {

    try {

        const { username } = req.params;

        const result = await User.deleteOne({ username });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            error: "Internal server error"
        });

    }

});


// UPDATE USER
app.put('/users/:username', async (req, res) => {

    try {

        const { username } = req.params;
        const { email, password } = req.body;

        const result = await User.updateOne(
            { username },
            { email, password }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                error: "User not found or no changes made"
            });
        }

        res.json({
            message: "User updated successfully"
        });

    } catch (err) {

        res.status(500).json({
            error: "Internal server error"
        });

    }

});


// SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});