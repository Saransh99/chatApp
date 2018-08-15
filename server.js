// these are all the modules which are going to be used in this file only
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
// connect-mongo is the session store for the express 
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
// the flash is a special area of the session used to storing messages
// messages are written to the flash and then cleared after being displayed to the user
// flash messages are stored in the session 
// after setting the flash middleware all the req will have an acess to the req.flash() function that wil display the flash messages
const flash = require('connect-flash');
const passport = require('passport');

const container = require('./container');

// mongodb://RoxFox:bits123098@ds119422.mlab.com:19422/chatapp'

// the container.resolve calls the call back function like a dependency function injecting any dependencies found in the signature
container.resolve(function(users,_,admin){
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/chatapp',{useNewUrlParser:true});
    const app = SetupExpress();

    function SetupExpress(){
        const app = express();
        const server = http.createServer(app);
        server.listen(3000,function(){
            console.log("listenig on the port 3000");
        });
        ConfigureExpress(app);

        // setting up the routere
        const router = require('express-promise-router')();
        users.SetRouting(router); // file in the controller folder
        admin.SetRouting(router);// file in the controllers folder

        app.use(router);
    }

    function ConfigureExpress(app){

        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');
        // the public folder wil contain all the static files that will be loaded 
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine','ejs');
        app.use(bodyParser.json()); // to parse the application/json
        // the bodyParser.urlencoded returns the middleware that only parses the urlencoded bodies that only looks at the req where the content type header matches the type options 
        // this accepts the utf-8 encoding of the body 
        app.use(bodyParser.urlencoded({extended:true}));

        app.use(validator());
        // create a session middleware with the given 
        app.use(session({
            secret: 'this is a secret dont share',
            resave:true,
            saveUninitialized:true,
            // establishing a new connection
            store:new MongoStore({mongooseConnection:mongoose.connection})
        }));

        app.use(flash());
        // the passport middleware is added after the session middleware
        app.use(passport.initialize());
        app.use(passport.session());
        app.locals._ = _;
    }
});