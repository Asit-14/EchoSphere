const express = require('express')
const { chats } = require('./data/data');
const app = express()


app.get('/', ( req,resp)=>{
    resp.send("Hello world")
});
app.get('/chats/data',(req,resp)=>{
    resp.send(chats)
});

app.get('/chats/data/:id',(req,resp)=>{
    // const id = req.params.id;
    // console.log(id);
    const chat = chats.find((chat) => chat._id === req.params.id);
    resp.send(chat);

});
app.listen(3000, console.log("Api is running  on 3000"));