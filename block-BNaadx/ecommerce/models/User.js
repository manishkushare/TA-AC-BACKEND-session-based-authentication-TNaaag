const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    password: {
        type : String,
        require : true 
    },
    isAdmin : {
        type : String,
        default : false
    },
    comments : [
        {
            type : Schema.Types.ObjectId,
            ref : "Comment"
        }
    ],
    likedProduct : [
        {
            type : Schema.Types.ObjectId,
            ref : "Product",
            unique :true
        }
    ],
    cart : [
        {
            type : Schema.Types.ObjectId,
            ref : "Product"
        }
    ]
});


userSchema.pre('save', async function(next){
    try {
        if(this.password && this.isModified('password')){
            const hashed = await bcrypt.hash(this.password,10);
            this.password = hashed;
            return next();
        }
    } catch (error) {
        return next(error);
    }
});

userSchema.methods.verifyPassword = async function(password){
    try {
        const verify =await bcrypt.compare(password,this.password);
        return verify;
    } catch (error) {
        return error
    }
}


const User = mongoose.model('User', userSchema);
module.exports = User;









