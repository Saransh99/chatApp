// mongoose is a mongodb object modeling tool designed to work in an asynchronous environment 

const mongoose = require('mongoose'); // we can also use the es6 import to import the packages
const bcrypt = require('bcrypt-nodejs');

//  models in the mongoose are defined using the Schema interface
const userSchema = mongoose.Schema({
    username:{type:String, unique:true},
    fullName:{type:String,unique:true,default:''},
    email:{type:String, unique:true},
    password:{type:String, default:''},
    userImage:{type:String, default:'default.png'},
    facebook:{type:String,default:''},
    fbTokens:Array,
    google:{type:String, default:''}
});

// we need to encrypt the password as we dont want to save the simple text as the password 
// bcrypt-nodejs is the module to encrypt the password 

// we can create our own methods for the instances of the Model
// the encyrptPassword and the validUserPassword are the custom methods 
userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null); // the hash will be of lenght 10
}

// now we need to check the user password entered to the password in the database
userSchema.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}

// we have defined the model with the mongoose.Model('modelName', schemaName);
// we can access the model through the same function mongoogse.model
module.exports = mongoose.model('User', userSchema);