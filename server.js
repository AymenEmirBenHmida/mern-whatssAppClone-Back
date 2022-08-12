import  express  from "express";
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from "pusher";
import cors from "cors";
//app config
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
    appId: "1460806",
    key: "5e7652f94587d86824a5",
    secret: "bf9db18219c89d6c2f42",
    cluster: "eu",
    useTLS: true
  });

// middleWare
app.use(express.json());
app.use(cors());

//DB config
const connection_url = 'mongodb+srv://aymen:pFwnT%40Vy_qn!7mj@cluster0.f2envhy.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connection_url,{
    useNewUrlParser : true,
    useUnifiedTopology: true,
});
const db = mongoose.connection
db.once('open',()=>{
    console.log("DB connected");
    const msgCollection = db.collection("messagecontents");
    const chanegStream = msgCollection.watch();

    chanegStream.on("change",(change)=>{
        console.log(change);
        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',{
                name:messageDetails.name,
                message : messageDetails.message,
                timestamp : messageDetails.timestamp,
                received : messageDetails.received
            });
        }else{
            console.log("Error triggering Pusher");
        }
    });
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