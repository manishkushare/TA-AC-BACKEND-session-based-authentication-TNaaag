const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type :String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
        minLength : 4

    }

});

userSchema.pre('save', async function(next){
    try{
        if(this.password && this.isModified('password')){
            const hashed =  await bcrypt.hash(this.password,10);
            this.password = hashed;
            return next();
        }
        else{
            return next();
        }
    }
    catch(err){
        return next(err);
    }

})

userSchema.methods.verifyPassword = async function(password){
    try{
        const verify =  await bcrypt.compare(password,this.password);
        return verify;
    }
    catch(err){
        return err;
    }
}
const User = mongoose.model('User', userSchema);
module.exports = User;