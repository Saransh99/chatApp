'use strict';

module.exports = function(){

    // we are using the basic express-validator for the validaton of the data in the form
    // all the methods like notEmpty(), isLength(), isEmail() are all built in methods for the express-validator
    return{
        SignUpValidation:(req,res,next)=>{
            req.checkBody('username','Username is mandatory').notEmpty();
            req.checkBody('username','Username cant be less than 5 chars').isLength({min:5});
            req.checkBody('email','email cant be empty').notEmpty();
            req.checkBody('email','must be an email').isEmail();
            req.checkBody('password','passeord cant be empty').notEmpty();
            req.checkBody('password','must be atleast 6 chars long').isLength({min:6});
            
            req.getValidationResult().then((result)=>{
                const errors = result.array();
                const messages = [];

                errors.forEach((error)=>{
                    messages.push(error.msg);
                });

                req.flash('error',messages);
                res.redirect('/signup');
            }).catch((err)=>{
                return next();
            });
        },


        LoginValidation:(req,res,next)=>{
            
            req.checkBody('email','email cant be empty').notEmpty();
            req.checkBody('email','must be an email').isEmail();
            req.checkBody('password','passeord cant be empty').notEmpty();
            req.checkBody('password','must be atleast 6 chars long').isLength({min:6});
            
            req.getValidationResult().then((result)=>{
                const errors = result.array();
                const messages = [];

                errors.forEach((error)=>{
                    messages.push(error.msg);
                });

                req.flash('error',messages);
                res.redirect('/');
            }).catch((err)=>{
                return next();
            });
        }
    }
}