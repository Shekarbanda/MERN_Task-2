const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    
            title:{
                type:String,
                
            },
            content:{
                type:String
            },
            image:{
                type:String
            },
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'socialmediauser',
                required: true
            },
            authorImage: {
                type: String
              },
            postType: { type: String, required: true },
            
            likes: [
                {
                  type: mongoose.Schema.Types.ObjectId, // Or 'String' if userId is stored as a string
                  ref: 'socialmediauser',
                },
              ],
            comments: [
                {
                    userId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'socialmediauser',
                    },
                    comment: {
                        type: String,
                    },
                    userName: String, 
                    userImage: String,
                    createdAt: {
                        type: Date,
                        default: Date.now,
                    },

                },
            ],
    
},{timestamps:true})

module.exports= mongoose.model('post',postSchema);

