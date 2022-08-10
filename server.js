import  express  from "express";
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
//app config
const app = express();
const port = process.env.PORT || 9000;

// middleWare
app.use(express.json());
//DB config
const connection_url = 'mongodb+srv://aymen:pFwnT%40Vy_qn!7mj@cluster0.f2envhy.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connection_url,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
});

//api routes
app.get('/',(req,res)=>res.status(200).send('hello aymen'));

app.post('/api/messages/new',(req, res)=>{
    const dbMessage = req.body
    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send('new message has been sent : \n '+data)
        }
    })
})
app.get('/api/messages/sync',(req,res)=>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

//listen
app.listen(port,()=> console.log('Listening on localhost:'+port));