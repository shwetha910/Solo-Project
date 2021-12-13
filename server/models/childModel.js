const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    child:{
        type:String,
        required:true
    },
    gender:String,
    parent:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});
const Users = mongoose.model('user',UserSchema);
module.exports  = {Users};
