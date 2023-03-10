const express = require('express');
const dotenv = require('dotenv');
const {mongoose } = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors');
const Pusher = require('pusher');
const app = express();

const userRouter = require('./routes/user');
const leaveRouter = require('./routes/leave');
const wfhRouter = require('./routes/wfh')

dotenv.config();
const port = process.env.PORT;
const URL = process.env.MONGO_URL;

app.use(express.json());
app.use(express.static('uploads'))
app.use(express.static('uploadFile'))
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

const pusher = new Pusher({
    appId: "1552037",
    key: "e9552c2250d8d44dd8fe",
    secret: "e824eb26c29ad2eadd57",
    cluster: "ap2",
    useTLS: true
  });
  const channel = 'users';

mongoose.set('strictQuery', false);
mongoose.connect(URL,()=>{
    console.log("DB connection successful!!!");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    app.listen(port,()=>{
        console.log(`Server is listening at ${port}`);
    })

    // const userCollection = db.collection('users');
    //   const changeStream = userCollection.watch();
        
      // changeStream.on('change', (change) => {
      //   if(change.operationType === 'update') {
      //       const task = change.fullDocument;
      //       pusher.trigger(
      //         channel,
      //         'inserted', 
      //         {
      //           task: task,
      //         }
      //       ); 
      //     }
      // });
});

app.use('/',userRouter);
app.use('/leave',leaveRouter);
app.use('/wfh',wfhRouter);

// app.listen(port,()=>{
//     console.log(`Server is listening at ${port}`);
// })