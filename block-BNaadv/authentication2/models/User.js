const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
        require: true
    },
    email : {
        type: String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true,
        minlength : 5
    }
});

userSchema.pre('save', async function(next){
    try {
        if(this.password && this.isModified('password')){
            
        }
    } catch (error) {
        return next(error);
    }
});


const User = mongosoe.model('User', userSchema);
module.exports = User;
