const express = require('express');
const dotenv = require('dotenv'); // Fixed typo: changed 'requrire' to 'require'
const { chats } = require('./data/data'); // Assuming 'data' exports an object with 'chats' property
const app = express();

dotenv.config();

app.get('/', (req, res) => {
    res.send('API is running');
});

app.get("/api/chat", (req, res) => {
    res.send(chats);
});

app.get("/api/data/:id", (req, res) => {
    console.log(req.params.id);
    // Fixed typo: changed 'chat' to 'chats' to refer to the correct variable
    const singleChat = chats.find((c) => c._id === req.params.id); // Make sure '_id' matches your data structure
    if (singleChat) {
        res.send(singleChat);
    } else {
        res.status(404).send({ message: 'Chat not found on web' }); // Added error handling for not found
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Fixed the console.log to correctly use PORT
});