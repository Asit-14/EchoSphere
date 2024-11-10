const express = require('express');
const { chats } = require('./data/data');
const app = express();
const port = 3000;
app.get('/',( req, res )=>{
    res.send('Api is running ');
});

app.get("/api/chat",(req,res)=>{
    res.send(chats);
});
app.get("/api/data/:id",(req,res)=>{
console.log(req.params.id);
});

app.listen(port,console.log("server is running on 3000"));