const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true,

    },
    age :{
        type : Number,

    },
    phone : {
        type : Number
    }

});

userSchema.pre('save', async function(next){
    if(this.password && this.isModified('password')){
        try{
            const hashed = await bcrypt.hash(this.password, 10);
            this.password = hashed;
            return next();
        } 
        catch(err){
            return next(err);
        }
    }
    else {
        return next();
    }

})

const User = mongoose.model('User', userSchema);

module.exports = User;