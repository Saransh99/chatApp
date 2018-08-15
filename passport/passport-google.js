'use strict';

const passport = require('passport');
const User = require('../models/user');
// the passport-google-oauth is used to login with google using the oauth1 or oauth2
const GoogleStratergy = require('passport-google-oauth').OAuth2Strategy;
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

passport.use(new GoogleStratergy({
    clientID:secret.google.clientID,
    clientSecret:secret.google.clientSecret,
    callbackURL:'http://localhost:3000/auth/google/callback',
    passReqToCallBack:true

},(req,accessToken,refreshToken, profile, done)=>{
    // we first check if the facebook profile exists or not 
    User.findOne({google:profile.id},(err,user)=>{
        if(err){
            return done(err);
        }

        if(user){
            return done(null, user);
        }else{
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullName = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile._json.image.URL;

            newUser.save((err)=>{
                if(err){
                    return done(err);
                }
                return done(null,newUser);
            });
        }
        
    });
}));





