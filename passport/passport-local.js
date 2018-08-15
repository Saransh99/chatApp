'use strict';

const passport = require('passport');
const User = require('../models/user');

// passport-local let you authenticate with the username and the password 
// the passport-local works great with the express 
const LocalStratergy = require('passport-local').Strategy;

// to maintain the persistent login sessions the authenticated user must be serialized to the session 
// and deserialized when the subsequent request are made
passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});

// the passport use the concept of the stratergies to authenticate the users 
// first we create a new LocalStratergy

passport.use('local.signup', new LocalStratergy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true

},(req,email,password,done)=>{
    User.findOne({'email':email},(err,user)=>{
        if(err){
            return done(err);
        }
        if(user){
            return done(null,false,req.flash('error','user with email already exist!!!'));
        }

        const newUser = new User();

        // the body parser will take the name of the input fields of the form 
        // the email input field has the name of username, email as the email and the password as the password 
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password); // now the password is encrypted

        // if the user is able to put the data in the form then we will save the data in the database
        newUser.save((err)=>{
            done(null,newUser);
        });
    });
}));





passport.use('local.login', new LocalStratergy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true

},(req,email,password,done)=>{
    User.findOne({'email':email},(err,user)=>{
        if(err){
            return done(err);
        }
        
        const messages = [];
        if(!user || !user.validUserPassword(password)){
            messages.push('email or pass is in correct');
            return done(null, false, req.flash('error', messages));
        }
        // if the user password matches with the email 
        return done(null,user);
    });
}));