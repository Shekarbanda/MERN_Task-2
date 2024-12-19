const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const user = require('./Models/UserModel.js');
const dbConnection = require('./utils/Connection.js');
const router = require('./routes/Routes.js');
const dotenv = require('dotenv');
const { is_login } = require('./Controllers/auth.js');
const cors = require('cors');
const path = require('path')
const userrouter = require('./Controllers/ProfileController')
const postrouter = require('./Controllers/PostsController.js')

const corsOptions = {
    origin: "http://localhost:3000",
    credentials:true
}
app.use(cors(corsOptions))

app.use('/Uploaded_Images', express.static(path.join(__dirname, 'Uploaded_Images')));

dotenv.config({
    path:'.env'
})

const port = process.env.PORT || 4000;

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.json());

dbConnection();

app.get('/',async (req,res)=>{
    is_login(req,res);
})

app.use("/api",router);
app.use('/api/user',userrouter);
app.use('/api/posts',postrouter)

app.get('/api/logout',(req,res)=>{
    res.cookie('token',"");
    res.status(200).json({
        message:"Logout Successfull",
        success:true
    })
})



app.listen(port,(err)=>{
    console.log("server started");
})
