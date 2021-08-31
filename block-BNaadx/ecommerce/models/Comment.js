const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content : {
        type : String,
        require : true
    },
    author : {
        type : String
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    productId : {
        type : Schema.Types.ObjectId,
        ref : "Product"
    }

});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;