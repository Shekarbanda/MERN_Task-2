const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profession:{
        type:String,
        default:"Profession"
    },
    city:{
        type:String,
        default:"City"
    },
    profile:{
        type:String,
        default:"/Uploaded_Images/profile.png"
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
},{timestamps:true})

module.exports= mongoose.model('socialmediauser',userSchema);

