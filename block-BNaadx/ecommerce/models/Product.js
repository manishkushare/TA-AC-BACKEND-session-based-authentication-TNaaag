const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name_of_product : {
        type : String,
        require : true
    },
    quantity_of_product : {
        type: Number,
        require : true,
    },
    price_of_product : {
        type : Number,
        require : true
    },
    avatar_of_product : {
        type : String
    },
    likes_of_product : {
        type : Number,
        default : 0
    },
    dislikes_of_product : {
        type : Number,
        default : 0
    },
    user_liked_product : [
        {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    comments_of_product : [
        {
            type : Schema.Types.ObjectId,
            ref : "Comment"
        }
    ]
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;