// these are all the modules which are going to be used in this file only
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');

const container = require('./container');


container.resolve(function(users){
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
        users.SetRouting(router);
        app.use(router);
    }

    function ConfigureExpress(app){
        // the public folder wil contain all the static files that will be loaded 
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine','ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));

        app.use(validator());
        app.use(session({
            secret: 'this is a secret dont share',
            resave:true,
            saveUninitialized:true,
            store:new MongoStore({mongooseConnection:mongoose.connection})
        }));

        app.use(flash());
    }
});