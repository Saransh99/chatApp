'use strict';

module.exports = function(_,passport,userValidation){
    return {
        SetRouting: function(router){
            router.get('/',this.indexPage);
            router.get('/signup',this.getSignUp);
            router.get('/home', this.homePage);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);


            router.post('/login', userValidation.LoginValidation, this.postLogin);
            router.post('/signup',userValidation.SignUpValidation, this.postSignUp);
        },

        indexPage: function(req,res){
            const errors = req.flash('error');
            return res.render('index',{title:'ChatForAll Login', messages:errors, hasErrors:errors.length>0});
        },

        postLogin: passport.authenticate('local.login',{
            successRedirect:'/home',
            failureRedirect:'/',
            failureFlash:true
        }),
        
        getSignUp:function (req,res){
            const errors = req.flash('error');
            // we only want to show the errors when there is one so we check the errors array if there is something inthe errors array then we display the error in the login screen
            return res.render('signup',{title:'ChatForAll SignUp', messages:errors, hasErrors:errors.length>0});  // this will look for a file in the views folder for the file named signup.ejs
        },

        postSignUp: passport.authenticate('local.signup',{
            successRedirect:'/home',
            failureRedirect:'/signup',
            failureFlash:true
        }),

        homePage:function(req,res){
            return res.render('home');
        },

        // for the facebook login 
        getFacebookLogin:passport.authenticate('facebook', {
            // the permissions from the user can be asked from the scope options 
            // here we require the user email for the login in the facebook
            scope:'email'
        }),

        facebookLogin:passport.authenticate('facebook',{
            successRedirect:'/home',
            failureRedirect:'/signup',
            failureFlash:true
        }),

        // for the google login

        getGoogleLogin:passport.authenticate('google',{
            scope:['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read']
        }),

        googleLogin:passport.authenticate('google',{
            successRedirect:'/home',
            failureRedirect:'/signup',
            failureFlash:true
        })

        
    }
}