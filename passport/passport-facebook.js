'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStratergy = require('passport-facebook').Strategy;
const secret = require('../secrets/secretFile');

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

passport.use(new FacebookStratergy({
    clientID:secret.facebook.clientID,
    clientSecret:secret.facebook.clientSecret,
    // to get the profile of the user we need thre profileField and can specify the fields we need from the user
    profileField:['email','displayName','photos'],
    callbackURL:'http://localhost:3000/auth/facebook/callback',
    passReqToCallBack:true

},(req,token,refreshToken, profile, done)=>{
    // we first check if the facebook profile exists or not 
    User.findOne({facebook:profile.id},(err,user)=>{
        if(err){
            return done(err);
        }
        if(user){
            return done(null,user); // if the profile id already exists then we will login in the user
        }else{ // else if the user doesnot exist then we create a new user
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullName = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
            newUser.fbTokens.push({token:token});
            newUser.save((err)=>{
                return done(null,user);
            });
        }// end of else
    });
}));





