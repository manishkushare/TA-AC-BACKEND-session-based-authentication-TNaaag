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
    password : {
        type : String,
        required : true,
    }
})

userSchema.pre('save', async function(next){
    if(this.password && this.isModified('password') ){
        try{
            const hashed = await bcrypt.hash(this.password,10);
            this.password = hashed;
            return next();
    
        }
        catch(err){
            return next(err);
        }
    }
    else {
        return next;
    }
});

userSchema.methods.verifyPassword = async function(password){
    try{
        const verify = await bcrypt.compare(password, this.password);
        console.log(verify,"💋")
        return verify;
    }
    catch(err){
        return err;
    }
}

const User = mongoose.model('User',userSchema);
module.exports = User;