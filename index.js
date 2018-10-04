var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('config');

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// insert routers here
var contactsRouter = require("./app/router/contacts-router")

app.use('/', contactsRouter);

var profileRouter = require("./app/router/profile-router")

app.use('/profile', profileRouter);

var contactApiRouter = require("./app/router/contact-api-router")

app.use(config.get('App.restApiEndpoint.version1ContactPath'), contactApiRouter);

var contactApiRouterv2 = require("./app/router/contact-api-router-v2")

app.use(config.get('App.restApiEndpoint.version2ContactPath'), contactApiRouterv2);

var port = config.get('App.webServer.port');

var mode = process.env.NODE_ENV || "development";

app.listen(port, function() {
	console.log("Mode: " + mode + ' listening on port ' + port);
});

